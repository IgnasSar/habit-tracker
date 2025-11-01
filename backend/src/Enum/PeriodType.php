<?php

declare(strict_types=1);

namespace App\Enum;

enum PeriodType: string
{
    case Daily = 'daily';
    case Weekly = 'weekly';

    case Monthly = 'monthly';

    public static function values(): array
    {
        return array_map(static fn (self $state) => $state->value, self::cases());
    }
}
