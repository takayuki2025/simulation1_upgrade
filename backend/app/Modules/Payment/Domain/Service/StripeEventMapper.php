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

        return match ($input->eventType) {

            'payment_intent.succeeded' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::SUCCEEDED,
                    $object['id'],
                    null,
                    $input->occurredAt,
                ),

            'payment_intent.payment_failed' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::FAILED,
                    $object['id'],
                    $object['last_payment_error']['message'] ?? null,
                    $input->occurredAt,
                ),

            'payment_intent.requires_action' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::REQUIRES_ACTION,
                    $object['id'],
                    null,
                    $input->occurredAt,
                ),

            default =>
                throw new \DomainException('Unhandled Stripe event: ' . $input->eventType),
        };
    }
}
