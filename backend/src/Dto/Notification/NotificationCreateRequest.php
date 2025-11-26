<?php

declare(strict_types=1);

namespace App\Dto\Notification;

use App\Enum\NotificationType;
use Symfony\Component\Validator\Constraints as Assert;

class NotificationCreateRequest {
    public function __construct(
        #[Assert\NotBlank(message: 'Message is required.')]
        #[Assert\Length(
            max: 255,
            maxMessage: 'Message cannot be longer than {{ limit }} characters.'
        )]
        public readonly ?string $message = null,

        #[Assert\NotBlank(message: 'Type is required.')]
        #[Assert\Choice(
            callback: [NotificationType::class, 'values'],
            message: 'Invalid notification type.'
        )]
        public readonly ?string $type = null,

        #[Assert\NotBlank(message: 'Target User ID is required.')]
        #[Assert\Uuid(message: 'Invalid User ID format.')]
        public readonly ?string $userId = null
    ) {}
}
