<?php

namespace App\Modules\Payment\Domain\Service;

use App\Modules\Payment\Application\Dto\HandlePaymentWebhookInput;
use App\Modules\Payment\Domain\Event\DomainPaymentEvent;
use App\Modules\Payment\Domain\Event\DomainPaymentEventType;

final class StripeEventMapper
{
    public function map(HandlePaymentWebhookInput $input): DomainPaymentEvent
    {
        $payload = $input->payload;
        $object  = $payload['data']['object'] ?? [];

        // ✅ event_type ごとに「最終的に payment_intent id (pi_...)」を取り出す
        $providerPaymentId = $this->extractPaymentIntentId($input->eventType, $object);

        // id が取れない場合は無視（500は返さない方針のまま）
        if (!is_string($providerPaymentId) || $providerPaymentId === '') {
            return DomainPaymentEvent::ignored($input->occurredAt);
        }

        // konbini instructions 抽出（PaymentIntentのときだけ成立する）
        $instructions = $this->extractKonbiniInstructions($object);

        return match ($input->eventType) {

            // ============================
            // PaymentIntent 正系
            // ============================
            'payment_intent.succeeded' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::SUCCEEDED,
                    $providerPaymentId,
                    null,
                    $input->occurredAt,
                    $instructions,
                ),

            'payment_intent.payment_failed' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::FAILED,
                    $providerPaymentId,
                    $object['last_payment_error']['message'] ?? null,
                    $input->occurredAt,
                    $instructions,
                ),

            'payment_intent.requires_action' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::REQUIRES_ACTION,
                    $providerPaymentId,
                    null,
                    $input->occurredAt,
                    $instructions,
                ),

            // created は揺れ対策（従来通り）
            'payment_intent.created' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::REQUIRES_ACTION,
                    $providerPaymentId,
                    null,
                    $input->occurredAt,
                    $instructions,
                ),

            // ============================
            // ✅ 実運用で来がちな補助イベント
            // これらも「最終的に pi_... を取れる」なら succeeded 扱いにする
            // ============================
            'charge.succeeded' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::SUCCEEDED,
                    $providerPaymentId,
                    null,
                    $input->occurredAt,
                    null, // charge には konbini details は無い
                ),

            'checkout.session.completed' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::SUCCEEDED,
                    $providerPaymentId,
                    null,
                    $input->occurredAt,
                    null,
                ),

            default =>
                DomainPaymentEvent::ignored($input->occurredAt),
        };
    }

    /**
     * event_type と object から「payment_intent id (pi_...)」を抽出する
     */
    private function extractPaymentIntentId(string $eventType, array $object): ?string
    {
        // payment_intent.* → object.id が pi_...
        if (str_starts_with($eventType, 'payment_intent.')) {
            $id = $object['id'] ?? null;
            return is_string($id) ? $id : null;
        }

        // charge.succeeded → object.payment_intent が pi_...
        if ($eventType === 'charge.succeeded') {
            $pi = $object['payment_intent'] ?? null;
            return is_string($pi) ? $pi : null;
        }

        // checkout.session.completed → object.payment_intent が pi_...
        if ($eventType === 'checkout.session.completed') {
            $pi = $object['payment_intent'] ?? null;
            return is_string($pi) ? $pi : null;
        }

        return null;
    }

    private function extractKonbiniInstructions(array $piObject): ?array
    {
        // Stripe: payment_intent.next_action.konbini_display_details
        $details = $piObject['next_action']['konbini_display_details'] ?? null;
        if (!is_array($details)) {
            return null;
        }

        $expiresAt = $details['expires_at'] ?? null;
        $store = $details['store'] ?? null;
        $confirmationNumber = $details['confirmation_number'] ?? null;

        $storeMap = null;
        if (is_string($store) && $store !== '' && is_string($confirmationNumber) && $confirmationNumber !== '') {
            $storeMap = [
                $store => [
                    'confirmation_number' => $confirmationNumber,
                ],
            ];
        }

        return [
            'type' => 'konbini',
            'expires_at' => is_int($expiresAt) ? $expiresAt : null,
            'store' => $storeMap,
        ];
    }
}
