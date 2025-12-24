<?php

namespace App\Modules\Shop\Domain\Enum;

enum LedgerType: string
{
    case SALE = 'sale';
    case REFUND = 'refund';
    case FEE = 'fee';
    case PAYOUT = 'payout';
    case ADJUSTMENT = 'adjustment';
}
