<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\User\Domain\Repository\UserAddressRepository;
use App\Modules\Order\Domain\ValueObject\Address;
use App\Shared\Domain\Clock\Clock;

final class ConfirmOrderAddressUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private UserAddressRepository $addresses,
        private Clock $clock,
    ) {
    }

    public function handle(int $orderId, int $userId, int $addressId): void
    {
        $order = $this->orders->findDraftByUser($orderId, $userId);

        $userAddress = $this->addresses->findOwnedByUser(
            addressId: $addressId,
            userId: $userId,
        );

        $address = new Address(
            postalCode: $userAddress->postalCode(),
            prefecture: $userAddress->prefecture(),
            city: $userAddress->city(),
            addressLine1: $userAddress->addressLine1(),
            addressLine2: $userAddress->addressLine2(),
            recipientName: $userAddress->recipientName(),
            phone: $userAddress->phone(),
        );

        // Domain にスナップショット確定
        $order->confirmAddress($address, $this->clock->now());

        // 永続化
        $this->orders->save($order);
    }
}
