<?php

declare(strict_types=1);

namespace App\Service\Habit;

use App\Dto\Habit\HabitCreateRequest;
use App\Dto\Habit\HabitUpdateRequest;
use App\Entity\Habit;
use App\Entity\User;
use App\Normalizer\HabitNormalizer;
use App\Repository\HabitRepository;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Enum\PeriodType;

class HabitCommandService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly HabitNormalizer $habitNormalizer,
        private readonly HabitRepository $habitRepository,
        private readonly Security $security
    )
    {
    }

    public function create(HabitCreateRequest $habitCreateRequest): array
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new BadRequestHttpException('Authenticated user not found or invalid.');
        }

        $habit = (new Habit())
            ->setName($habitCreateRequest->name)
            ->setTargetCount($habitCreateRequest->targetCount)
            ->setPeriodType(PeriodType::from($habitCreateRequest->periodType))
            ->setPeriodLength($habitCreateRequest->periodLength)
            ->setUser($user);

        try {
            $this->entityManager->persist($habit);
            $this->entityManager->flush();
        } catch (Exception $exception) {
            throw $exception;
        }

        return $this->habitNormalizer->normalize($habit);
    }

    public function update(
        int $id,
        HabitUpdateRequest $habitUpdateRequest
    ): array
    {
        $habit = $this->habitRepository->findOneById($id);

        if ($habit === null) {
            throw new NotFoundHttpException('Habit not found.');
        }

        $habit->setName($habitUpdateRequest->name)
            ->setTargetCount($habitUpdateRequest->targetCount)
            ->setPeriodType(PeriodType::from($habitUpdateRequest->periodType))
            ->setPeriodLength($habitUpdateRequest->periodLength)
            ->setUpdatedAt(
                new DateTimeImmutable('now', new DateTimeZone('UTC')
                )
            );

        $this->entityManager->flush();

        return $this->habitNormalizer->normalize($habit);
    }


    public function delete(int $id): void
    {
        $habit = $this->habitRepository->findOneById($id);

        if ($habit === null) {
            throw new NotFoundHttpException('Habit not found.');
        }

        $this->entityManager->remove($habit);
        $this->entityManager->flush();
    }
}
