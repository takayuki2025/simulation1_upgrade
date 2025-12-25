<?php

namespace App\Modules\Payment\Domain\Service;

use App\Modules\Payment\Application\Dto\HandlePaymentWebhookInput;
use App\Modules\Payment\Domain\Event\DomainPaymentEvent;
use App\Modules\Payment\Domain\Event\DomainPaymentEventType;

final class StripeEventMapper
{
    public function map(HandlePaymentWebhookInput $input): DomainPaymentEvent
    {
        $object = $input->payload['data']['object'] ?? [];

        // payment_intent 系以外は v1 ではすべて無視
        if (!str_starts_with($input->eventType, 'payment_intent.')) {
            return DomainPaymentEvent::ignored($input->occurredAt);
        }

        $providerPaymentId = $object['id'] ?? null;

        // payment_intent なのに id が無い = 異常 → 無視
        if (!is_string($providerPaymentId) || $providerPaymentId === '') {
            return DomainPaymentEvent::ignored($input->occurredAt);
        }

        // ============================
        // konbini instructions 抽出
        // ============================
        $instructions = $this->extractKonbiniInstructions($object);

        return match ($input->eventType) {

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

            // created でも拾える場合がある（イベント順の揺れ対策）
            'payment_intent.created' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::REQUIRES_ACTION,
                    $providerPaymentId,
                    null,
                    $input->occurredAt,
                    $instructions,
                ),

            default =>
                DomainPaymentEvent::ignored($input->occurredAt),
        };
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
