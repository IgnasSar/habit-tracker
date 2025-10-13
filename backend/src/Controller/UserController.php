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

    #[Route('/me', name: 'get_one_user', methods: ['GET'])]
    public function get(): JsonResponse {
        return new JsonResponse(
            $this->userQueryService->get(),
            Response::HTTP_OK
        );
    }

    #[Route(name: 'get_all_user', methods: ['GET'])]
    public function getAll(): JsonResponse {
        return new JsonResponse(
            $this->userQueryService->getAll(),
            Response::HTTP_OK
        );
    }

    #[Route('/{username}', name: 'update_user', methods: ['PUT'])]
    public function update(
        string $username,
        #[MapRequestPayload] UserUpdateRequest $userUpdateRequest
    ): JsonResponse {
        return new JsonResponse(
            $this->userCommandService->update($username, $userUpdateRequest),
            Response::HTTP_OK
        );
    }

    #[Route('/{username}', name: 'delete_user', methods: ['DELETE'])]
    public function delete(string $username): JsonResponse {
        $this->userCommandService->delete($username);

        return new JsonResponse(
            status: Response::HTTP_NO_CONTENT
        );
    }
}
