<?php

declare(strict_types=1);

namespace App\Service\Notification;

use App\Normalizer\NotificationNormalizer;
use App\Repository\NotificationRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class NotificationQueryService {
    public function __construct(
        private readonly NotificationNormalizer $notificationNormalizer,
        private readonly NotificationRepository $notificationRepository,
    ) {}

    public function get(int $id): array
    {
        $notification = $this->notificationRepository->findOneById($id);

        if ($notification === null) {
            throw new NotFoundHttpException('Notification not found.');
        }

        return $this->notificationNormalizer->normalize($notification);
    }

    public function getAll(int $page, int $limit): array
    {
        $paginator = $this->notificationRepository->findAllPaginated($page, $limit);

        $normalized = [];

        foreach ($paginator as $notification) {
            $normalized[] = $this->notificationNormalizer->normalize($notification);
        }

        return $normalized;
    }

    public function getUnread(string $userId): array
    {
        $notifications = $this->notificationRepository->findUnreadForUser($userId, 2);

        return array_map(
            fn($n) => $this->notificationNormalizer->normalize($n),
            $notifications
        );
    }
}
