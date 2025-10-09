<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\User;

class UserNormalizer
{
    public function normalize(User $user): array
    {
        return [
            'id' => $user->getId()->toRfc4122(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'last_login' => $user->getLastLogin()?->format('Y-m-d H:i:s'),
            'created_at' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
