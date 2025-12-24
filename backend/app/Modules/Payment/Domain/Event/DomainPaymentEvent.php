<?php

namespace App\Modules\Payment\Domain\Event;

final class DomainPaymentEvent
{
    public function __construct(
        public readonly DomainPaymentEventType $type,
        public readonly string $providerPaymentId,
        public readonly ?string $reason,
        public readonly \DateTimeImmutable $occurredAt,
    ) {
    }
}
