<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Domain\ValueObject\Address;
use App\Models\UserAddress;
use DomainException;
use DateTimeImmutable;

final class ConfirmOrderAddressUseCase
{
    public function __construct(
        private OrderRepository $orders
    ) {
    }

    public function handle(int $orderId, int $addressId): void
    {
        $order = $this->orders->findById($orderId);

        if (! $order) {
            throw new DomainException('Order not found');
        }

        $userAddress = UserAddress::find($addressId);

        if (! $userAddress) {
            throw new DomainException('Address not found');
        }

        // UserAddress → Order Address(ValueObject)
        $address = new Address(
            postalCode: $userAddress->post_number,
            prefecture: $userAddress->prefecture,
            city: $userAddress->city,
            addressLine1: $userAddress->address_line1,
            addressLine2: $userAddress->address_line2,
            recipientName: $userAddress->recipient_name,
            phone: $userAddress->phone,
        );

        // ★ ここが今回の本質
        $order->confirmAddress(
            $address,
            new DateTimeImmutable()
        );

        $this->orders->save($order);
    }
}
