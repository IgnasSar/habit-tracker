<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User;
use App\Dto\UserCreateRequest;
use App\Normalizer\UserNormalizer;
use Doctrine\ORM\EntityManagerInterface;

class UserCommandService {
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserNormalizer $userNormalizer
    ) {}

    public function create(UserCreateRequest $userCreateRequest): array
    {
        $user = (new User())
            ->setUsername($userCreateRequest->username)
            ->setEmail($userCreateRequest->email)
            ->setPasswordHash(password_hash($userCreateRequest->password, PASSWORD_BCRYPT));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->userNormalizer->normalize($user);
    }
}
