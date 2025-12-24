<?php

namespace Tests\Feature\OrderPayment;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Support\Facades\DB;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;
use App\Modules\Payment\Domain\Enum\PaymentMethod;
use App\Modules\Payment\Application\UseCase\HandlePaymentWebhookUseCase;
use App\Modules\Payment\Application\Dto\HandlePaymentWebhookInput;

final class OrderPaymentFlowTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    public function test_order_payment_flow_card_then_webhook_succeeded(): void
    {
        /* =====================================================
           1) Gateway Fake（Payment Start 用）
        ===================================================== */
        $this->app->bind(PaymentGatewayPort::class, function () {
            return new class () implements PaymentGatewayPort {
                public function start(
                    PaymentMethod $method,
                    int $amount,
                    string $currency,
                    array $context
                ): array {
                    return [
                        'provider_payment_id' => 'pi_test_flow_123',
                        'client_secret' => 'cs_test_flow_123',
                        'requires_action' => false,
                        'status' => 'requires_payment_method',
                    ];
                }

                // Webhook は UseCase 直呼びなので実際は未使用
                public function parseWebhook(string $payload, string $signature): array
                {
                    return [];
                }
            };
        });

        /* =====================================================
           2) User / Order 作成
        ===================================================== */
        $user = User::factory()->create();
        $this->actingAs($user);

        $orderId = DB::table('orders')->insertGetId([
            'shop_id' => 1,
            'user_id' => $user->id,
            'status' => 'pending_payment',
            'total_amount' => 2000,
            'currency' => 'JPY',
            'items_snapshot' => json_encode([
                [
                    'item_id' => 1,
                    'name' => 'Sample',
                    'price_amount' => 2000,
                    'price_currency' => 'JPY',
                    'quantity' => 1,
                ]
            ], JSON_UNESCAPED_UNICODE),
            'meta' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /* =====================================================
           3) Payment Start（HTTP）
        ===================================================== */
        $res = $this->postJson('/api/payments/start', [
            'order_id' => $orderId,
            'method' => 'card',
        ]);

        $res->assertStatus(200);

        $paymentId = (int) $res->json('payment_id');

        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'order_id' => $orderId,
            'provider' => 'stripe',
            'provider_payment_id' => 'pi_test_flow_123',
        ]);

        /* =====================================================
           4) Webhook UseCase（正規 Stripe payload）
        ===================================================== */
        /** @var HandlePaymentWebhookUseCase $webhook */
        $webhook = app(HandlePaymentWebhookUseCase::class);

        $payloadArray = [
            'id' => 'evt_test_flow_001',
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_flow_123',
                ],
            ],
        ];

        $payloadJson = json_encode($payloadArray, JSON_UNESCAPED_UNICODE);

        $input = new HandlePaymentWebhookInput(
            provider: 'stripe',
            eventId: 'evt_test_flow_001',
            eventType: 'payment_intent.succeeded',
            payload: $payloadArray,
            payloadHash: hash('sha256', $payloadJson),
            occurredAt: new \DateTimeImmutable(),
        );

        // 1回目（処理される）
        $webhook->handle($input);

        // 2回目（冪等：no-op）
        $webhook->handle($input);

        /* =====================================================
           5) 検証
        ===================================================== */

        // Webhook イベントは 1 件のみ
        $this->assertSame(
            1,
            DB::table('processed_webhook_events')
                ->where('provider', 'stripe')
                ->where('event_id', 'evt_test_flow_001')
                ->count()
        );

        // Payment が succeeded
        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'status' => 'succeeded',
        ]);

        // Order が paid
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'paid',
        ]);
    }
}
