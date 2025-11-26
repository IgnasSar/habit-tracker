<?php

declare(strict_types=1);

namespace App\Enum;

enum NotificationType: string
{
    case Email = 'email';
    case System = 'system';

    public static function values(): array
    {
        return array_map(static fn (self $state) => $state->value, self::cases());
    }
}
