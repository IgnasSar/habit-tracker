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

    public function getAll(int $page, int $limit): array
    {
        $paginator = $this->userRepository->findAllPaginated($page, $limit);

        $normalized = [];

        foreach ($paginator as $user) {
            $normalized[] = $this->userNormalizer->normalize($user);
        }

        return $normalized;
    }
}
