<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User;
use App\Dto\UserCreateRequest;
use App\Normalizer\UserNormalizer;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

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

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (Exception $exception) {
            if ($exception instanceof UniqueConstraintViolationException) {
                $msg = $exception->getMessage();
                $errors = [];

                if (str_contains($msg, '(username)')) {
                    $errors['username'] = 'Username already exists.';
                }

                if (str_contains($msg, '(email)')) {
                    $errors['email'] = 'Email already exists.';
                }

                throw new BadRequestHttpException(
                    json_encode(['errors' => $errors]),
                    $exception
                );
            }
            throw $exception;
        }

        return $this->userNormalizer->normalize($user);
    }
}
