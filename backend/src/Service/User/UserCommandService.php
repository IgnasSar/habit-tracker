<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Dto\User\UserCreateRequest;
use App\Dto\User\UserUpdateRequest;
use App\Entity\User;
use App\Normalizer\UserNormalizer;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserCommandService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserNormalizer         $userNormalizer,
        private readonly UserRepository         $userRepository,
    )
    {
    }

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

    public function update(
        string $username,
        UserUpdateRequest $userUpdateRequest
    ): array
    {
        $user = $this->userRepository->findOneByUsername($username);

        if ($user === null) {
            throw new NotFoundHttpException('User not found.');
        }

        $errors = [];

        if ($userUpdateRequest->username !== null) {
            $existingUser = $this->userRepository
                ->findOneByUsername($userUpdateRequest->username);

            if ($existingUser !== null && $existingUser->getId() !== $user->getId()) {
                $errors['username'] = 'Username is already taken by another user.';
            } elseif ($userUpdateRequest->username === $user->getUsername()) {
                $errors['username'] = 'Username is already set to this value.';
            } else {
                $user->setUsername($userUpdateRequest->username);
            }
        }

        if ($userUpdateRequest->password !== null) {
            if (password_verify($userUpdateRequest->password, $user->getPasswordHash())) {
                $errors['password'] = 'Password is already set to this value.';
            } else {
                $user->setPasswordHash(password_hash($userUpdateRequest->password, PASSWORD_BCRYPT));
            }
        }

        if ($userUpdateRequest->role !== null) {
            if ($userUpdateRequest->role === $user->getRole()) {
                $errors['role'] = 'Role is already set to this value.';
            } else {
                $user->setRole($userUpdateRequest->role);
            }
        }

        if (!empty($errors)) {
            throw new BadRequestHttpException(json_encode(['errors' => $errors]));
        }

        $this->entityManager->flush();

        return $this->userNormalizer->normalize($user);
    }


    public function delete(string $username): void
    {
        $user = $this->userRepository->findOneByUsername($username);

        if ($user === null) {
            throw new NotFoundHttpException('User not found.');
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
}
