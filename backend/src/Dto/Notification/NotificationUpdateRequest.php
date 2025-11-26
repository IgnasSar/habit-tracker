<?php

declare(strict_types=1);

namespace App\Dto\Notification;

use App\Enum\NotificationType;
use Symfony\Component\Validator\Constraints as Assert;

class NotificationUpdateRequest {
    public function __construct(
        #[Assert\Length(
            max: 255,
            maxMessage: 'Message cannot be longer than {{ limit }} characters.'
        )]
        public readonly ?string $message = null,

        #[Assert\Choice(
            callback: [NotificationType::class, 'values'],
            message: 'Invalid notification type.'
        )]
        public readonly ?string $type = null,

        #[Assert\Type(type: 'bool')]
        public readonly ?bool $isRead = null
    ) {}
}
