<?php

declare(strict_types=1);

namespace App\Message;

class SendHabitReminder
{
    public function __construct(
        public readonly ?string $userId = null,
        public readonly ?string $habitName = null,
        public readonly ?string $emailAddress = null
    ) {}
}
