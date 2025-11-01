<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Habit\HabitUpdateRequest;
use App\Dto\Habit\HabitCreateRequest;
use App\Service\Habit\HabitCommandService;
use App\Service\Habit\HabitQueryService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/habits')]
class HabitController {

    public function __construct(
        private readonly HabitCommandService $habitCommandService,
        private readonly HabitQueryService $habitQueryService,
    ) {}

    #[Route(name: 'create_habit', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] HabitCreateRequest $habitCreateRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->habitCommandService->create($habitCreateRequest),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'get_one_habit', methods: ['GET'])]
    public function get(int $id): JsonResponse {
        return new JsonResponse(
            $this->habitQueryService->get($id),
            Response::HTTP_OK
        );
    }

    #[Route(name: 'get_all_habits', methods: ['GET'])]
    public function getAll(
        #[MapQueryParameter] int $page = 1,
        #[MapQueryParameter] int $limit = 10
    ): JsonResponse {
        return new JsonResponse(
            $this->habitQueryService->getAll($page, $limit),
            Response::HTTP_OK
        );
    }

    #[Route('/{id}', name: 'update_habit', methods: ['PUT'])]
    public function update(
        int $id,
        #[MapRequestPayload] HabitUpdateRequest $habitUpdateRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->habitCommandService->update($id, $habitUpdateRequest),
            Response::HTTP_OK
        );
    }

    #[Route('/{id}', name: 'delete_habit', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse {
        $this->habitCommandService->delete($id);

        return new JsonResponse(
            status: Response::HTTP_NO_CONTENT
        );
    }
}
