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

final class OrderPaymentFlowTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    public function test_order_payment_flow_card_then_webhook_succeeded(): void
    {
        // 1) Gateway を Fake（start と parseWebhook を制御）
        $this->app->bind(PaymentGatewayPort::class, function () {
            return new class () implements PaymentGatewayPort {
                public function start(PaymentMethod $method, int $amount, string $currency, array $context): array
                {
                    // StartPaymentUseCase が payments を作った後に呼ばれる
                    return [
                        'provider_payment_id' => 'pi_test_flow_123',
                        'client_secret' => 'cs_test_flow_123',
                        'requires_action' => false,
                        'status' => 'requires_payment_method',
                    ];
                }

                public function parseWebhook(string $payload, array $headers): array
                {
                    // Webhook UseCase に渡した payload/headers を無視して、
                    // 「succeeded」を再現する
                    return [
                        'provider_event_id' => 'evt_test_flow_001',
                        'event_type' => 'payment_intent.succeeded',
                        'provider_payment_id' => 'pi_test_flow_123',
                        'status' => 'succeeded',
                    ];
                }
            };
        });

        // 2) User / Order を最小生成
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

        // 3) Payment start（HTTP 経由で結合）
        $res = $this->postJson('/api/payments/start', [
            'order_id' => $orderId,
            'method' => 'card',
        ]);

        $res->assertStatus(200);
        $res->assertJsonStructure([
            'payment_id',
            'status',
            'provider_payment_id',
            'client_secret',
            'instructions',
        ]);

        $paymentId = (int) $res->json('payment_id');

        // 4) payments に provider_payment_id が入ったこと
        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'order_id' => $orderId,
            'provider' => 'stripe',
            'method' => 'card',
            'provider_payment_id' => 'pi_test_flow_123',
        ]);

        // 5) Webhook（UseCase 直で結合）
        /** @var HandlePaymentWebhookUseCase $webhook */
        $webhook = app(HandlePaymentWebhookUseCase::class);

        $payload = '{"type":"payment_intent.succeeded"}';
        $headers = ['stripe-signature' => 'test']; // Fake gatewayなので使わない

        $out = $webhook->handle($payload, $headers);

        $this->assertTrue($out['ok']);

        // 6) processed_webhook_events が記録される（冪等の証拠）
        $this->assertDatabaseHas('processed_webhook_events', [
            'provider' => 'stripe',
            'event_id' => 'evt_test_flow_001',
            'event_type' => 'payment_intent.succeeded',
        ]);

        // 7) Payment status が succeeded
        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'status' => 'succeeded',
        ]);

        // 8) Order status が paid
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'paid',
        ]);

        // 9) 冪等：同じ webhook をもう一度投げても processed が増えない（no-op）
        $out2 = $webhook->handle($payload, $headers);
        $this->assertTrue($out2['ok']);
        $this->assertTrue($out2['idempotent']);

        $count = DB::table('processed_webhook_events')
            ->where('provider', 'stripe')
            ->where('event_id', 'evt_test_flow_001')
            ->count();
        $this->assertSame(1, $count);
    }
}
