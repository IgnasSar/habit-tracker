<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Normalizer\UserNormalizer;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserQueryService {
    public function __construct(
        private readonly Security $security,
        private readonly UserNormalizer $userNormalizer
    ) {}

    public function get(): array
    {
        $user  = $this->security->getUser();

        if(null === $user) {
            throw new NotFoundHttpException('User not found.');
        }

        return $this->userNormalizer->normalize($user);
    }

}
