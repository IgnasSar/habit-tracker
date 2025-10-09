<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\UserCreateRequest;
use App\Service\User\UserCommandService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/users')]
class UserController {

    public function __construct(
        private readonly UserCommandService $userCommandService
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
}
