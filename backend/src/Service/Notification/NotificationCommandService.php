<?php

declare(strict_types=1);

namespace App\Service\Notification;

use App\Dto\Notification\NotificationCreateRequest;
use App\Dto\Notification\NotificationUpdateRequest;
use App\Entity\Notification;
use App\Enum\NotificationType;
use App\Normalizer\NotificationNormalizer;
use App\Repository\NotificationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class NotificationCommandService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly NotificationNormalizer $notificationNormalizer,
        private readonly NotificationRepository $notificationRepository,
        private readonly UserRepository $userRepository,
    ) {}

    public function create(NotificationCreateRequest $createRequest): array
    {
        $user = $this->userRepository->findOneBy(['id' => $createRequest->userId]);

        if ($user === null) {
            throw new NotFoundHttpException('Target user not found.');
        }

        $notification = (new Notification())
            ->setMessage($createRequest->message)
            ->setType(NotificationType::from($createRequest->type))
            ->setUser($user);

        $this->entityManager->persist($notification);
        $this->entityManager->flush();

        return $this->notificationNormalizer->normalize($notification);
    }

    public function update(int $id, NotificationUpdateRequest $updateRequest): array
    {
        $notification = $this->notificationRepository->findOneById($id);

        if ($notification === null) {
            throw new NotFoundHttpException('Notification not found.');
        }

        if ($updateRequest->message !== null) {
            $notification->setMessage($updateRequest->message);
        }

        if ($updateRequest->type !== null) {
            $notification->setType(NotificationType::from($updateRequest->type));
        }

        if ($updateRequest->isRead !== null) {
            $notification->setIsRead($updateRequest->isRead);
        }

        $this->entityManager->flush();

        return $this->notificationNormalizer->normalize($notification);
    }

    public function delete(int $id): void
    {
        $notification = $this->notificationRepository->findOneById($id);

        if ($notification === null) {
            throw new NotFoundHttpException('Notification not found.');
        }

        $this->entityManager->remove($notification);
        $this->entityManager->flush();
    }
}
