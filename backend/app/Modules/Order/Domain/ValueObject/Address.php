<?php

namespace App\Modules\Order\Domain\ValueObject;

final class Address
{
    public function __construct(
        public readonly string $postalCode,
        public readonly string $prefecture,
        public readonly string $city,
        public readonly string $addressLine1,
        public readonly ?string $addressLine2 = null,
        public readonly ?string $recipientName = null,
        public readonly ?string $phone = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            postalCode: $data['postal_code'],
            prefecture: $data['prefecture'],
            city: $data['city'],
            addressLine1: $data['address_line1'],
            addressLine2: $data['address_line2'] ?? null,
            recipientName: $data['recipient_name'] ?? null,
            phone: $data['phone'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'postal_code' => $this->postalCode,
            'prefecture' => $this->prefecture,
            'city' => $this->city,
            'address_line1' => $this->addressLine1,
            'address_line2' => $this->addressLine2,
            'recipient_name' => $this->recipientName,
            'phone' => $this->phone,
        ];
    }
}
