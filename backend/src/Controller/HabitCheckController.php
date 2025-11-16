<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\HabitCheck\HabitCheckCreateRequest;
use App\Dto\HabitCheck\HabitCheckUpdateRequest;
use App\Service\HabitCheck\HabitCheckCommandService;
use App\Service\HabitCheck\HabitCheckQueryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

class HabitCheckController extends AbstractController
{
    public function __construct(
        private readonly HabitCheckCommandService $habitCheckCommandService,
        private readonly HabitCheckQueryService $habitCheckQueryService,
    ) {
    }

    #[Route('/habits/{habitId}/checks', name: 'habit_check_create', methods: ['POST'])]
    public function create(
        int $habitId,
        #[MapRequestPayload] HabitCheckCreateRequest $habitCheckCreateRequest
    ): JsonResponse {
        $habitCheck = $this->habitCheckCommandService->create($habitId, $habitCheckCreateRequest);

        return $this->json($habitCheck, Response::HTTP_CREATED);
    }

    #[Route('/habits/{habitId}/checks', name: 'habit_check_list', methods: ['GET'])]
    public function listForHabit(
        int $habitId,
        #[MapQueryParameter(name: 'from_date')] ?string $fromDate = null,
        #[MapQueryParameter(name: 'to_date')] ?string $toDate = null
    ): JsonResponse {
        $habitChecks = $this->habitCheckQueryService->findByHabitAndDateRange($habitId, $fromDate, $toDate);

        return $this->json($habitChecks);
    }

    #[Route('/habit-checks/{id}', name: 'habit_check_get_one', methods: ['GET'])]
    public function get(int $id): JsonResponse
    {
        $habitCheck = $this->habitCheckQueryService->get($id);

        return $this->json($habitCheck);
    }

    #[Route('/habit-checks/{id}', name: 'habit_check_update', methods: ['PUT', 'PATCH'])]
    public function update(
        int $id,
        #[MapRequestPayload] HabitCheckUpdateRequest $habitCheckUpdateRequest
    ): JsonResponse {
        $habitCheck = $this->habitCheckCommandService->update($id, $habitCheckUpdateRequest);

        return $this->json($habitCheck);
    }

    #[Route('/habit-checks/{id}', name: 'habit_check_delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $this->habitCheckCommandService->delete($id);

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
