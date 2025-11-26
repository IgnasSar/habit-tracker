<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Notification\NotificationCreateRequest;
use App\Dto\Notification\NotificationUpdateRequest;
use App\Service\Notification\NotificationCommandService;
use App\Service\Notification\NotificationQueryService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/notifications')]
class NotificationController {

    public function __construct(
        private readonly NotificationCommandService $notificationCommandService,
        private readonly NotificationQueryService $notificationQueryService,
    ) {}

    #[Route(name: 'create_notification', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] NotificationCreateRequest $createRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->notificationCommandService->create($createRequest),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'get_one_notification', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function get(int $id): JsonResponse {
        return new JsonResponse(
            $this->notificationQueryService->get($id),
            Response::HTTP_OK
        );
    }

    #[Route(name: 'get_all_notifications', methods: ['GET'])]
    public function getAll(
        #[MapQueryParameter] int $page = 1,
        #[MapQueryParameter] int $limit = 10
    ): JsonResponse {
        return new JsonResponse(
            $this->notificationQueryService->getAll($page, $limit),
            Response::HTTP_OK
        );
    }

    #[Route('/{id}', name: 'update_notification', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function update(
        int $id,
        #[MapRequestPayload] NotificationUpdateRequest $updateRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->notificationCommandService->update($id, $updateRequest),
            Response::HTTP_OK
        );
    }

    #[Route('/{id}', name: 'delete_notification', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id): JsonResponse {
        $this->notificationCommandService->delete($id);

        return new JsonResponse(
            status: Response::HTTP_NO_CONTENT
        );
    }
}
