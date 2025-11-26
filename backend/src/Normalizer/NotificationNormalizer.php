<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\Notification;

class NotificationNormalizer
{
    public function normalize(Notification $notification): array
    {
        return [
            'id' => $notification->getId(),
            'message' => $notification->getMessage(),
            'type' => $notification->getType()->value,
            'is_read' => $notification->isRead(),
            'user_id' => $notification->getUser()->getId()->toRfc4122(),
            'created_at' => $notification->getCreatedAt()
                ->format('Y-m-d H:i:s'),
        ];
    }
}
