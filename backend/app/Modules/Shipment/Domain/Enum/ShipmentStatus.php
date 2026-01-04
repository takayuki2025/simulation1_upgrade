<?php

namespace App\Modules\Shipment\Domain\Enum;

enum ShipmentStatus: string
{
    case DRAFT = 'draft';         // 入金済・未受付
    case PACKED = 'packed';       // 受付・在庫確保・梱包中
    case SHIPPED = 'shipped';     // 発送済
    case IN_TRANSIT = 'in_transit';
    case DELIVERED = 'delivered';
}
