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

        // Stripe payload の "id" は eventType によって意味が違うので注意
        // payment_intent.* の場合: object['id'] は "pi_***"
        // charge.* の場合: object['id'] は "ch_***"

        return match ($input->eventType) {

            'payment_intent.succeeded' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::SUCCEEDED,
                    $object['id'] ?? null,
                    null,
                    $input->occurredAt,
                ),

            'payment_intent.payment_failed' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::FAILED,
                    $object['id'] ?? null,
                    $object['last_payment_error']['message'] ?? null,
                    $input->occurredAt,
                ),

            'payment_intent.requires_action' =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::REQUIRES_ACTION,
                    $object['id'] ?? null,
                    null,
                    $input->occurredAt,
                ),

            // ★重要：Stripe CLI / 実運用では charge.* や payment_intent.created も普通に来る
            // ここで例外 throw すると Stripe がリトライ地獄になるので「無視」が正解
            default =>
                new DomainPaymentEvent(
                    DomainPaymentEventType::IGNORED,
                    null,
                    null,
                    $input->occurredAt,
                ),
        };
    }
}
