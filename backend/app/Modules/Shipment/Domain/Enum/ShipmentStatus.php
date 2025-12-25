<?php

namespace App\Modules\Shipment\Domain\Enum;

enum ShipmentStatus: string
{
    case CREATED = 'created';
    case PACKED = 'packed';
    case SHIPPED = 'shipped';
    case IN_TRANSIT = 'in_transit';
    case DELIVERED = 'delivered';
    case DELAYED = 'delayed';
    case CANCELLED = 'cancelled';
}
