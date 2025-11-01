<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\User\UserCreateRequest;
use App\Dto\User\UserUpdateRequest;
use App\Service\User\UserCommandService;
use App\Service\User\UserQueryService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

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
    public function getAll(
        #[MapQueryParameter] int $page = 1,
        #[MapQueryParameter] int $limit = 10
    ): JsonResponse {
        return new JsonResponse(
            $this->userQueryService->getAll($page, $limit),
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
