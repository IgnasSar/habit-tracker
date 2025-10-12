<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\UserCreateRequest;
use App\Dto\UserUpdateRequest;
use App\Service\User\UserCommandService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\User\UserQueryService;

#[Route('/users')]
class UserController {

    public function __construct(
        private readonly UserCommandService $userCommandService,
        private readonly UserQueryService $userQueryService,
    ) {}

    #[Route(name: 'create_user', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] UserCreateRequest $userCreateRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->userCommandService->create($userCreateRequest),
            Response::HTTP_CREATED
        );
    }

    #[Route(name: 'get_one_user', methods: ['GET'])]
    public function get(): JsonResponse {
        return new JsonResponse(
            $this->userQueryService->get(),
            Response::HTTP_CREATED
        );
    }

    #[Route(name: 'update_user', methods: ['PUT'])]
    public function update(
        #[MapRequestPayload] UserUpdateRequest $userUpdateRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->userCommandService->update($userUpdateRequest),
            Response::HTTP_CREATED
        );
    }
}
