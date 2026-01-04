<?php

namespace App\Modules\Shipment\Domain\Enum;

enum ShipmentStatus: string
{
    case DRAFT = 'draft';
    case READY = 'ready';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELED = 'canceled';
}
