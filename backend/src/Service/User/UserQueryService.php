<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Normalizer\UserNormalizer;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserQueryService {
    public function __construct(
        private readonly Security $security,
        private readonly UserNormalizer $userNormalizer,
        private readonly UserRepository $userRepository,
    ) {}

    public function get(): array
    {
        $user  = $this->security->getUser();

        if(null === $user) {
            throw new NotFoundHttpException('User not found.');
        }

        return $this->userNormalizer->normalize($user);
    }

    public function getAll(): array
    {
        $users = $this->userRepository->findAll();

        return array_map(
            fn($user) => $this->userNormalizer->normalize($user),
            $users
        );
    }

}
