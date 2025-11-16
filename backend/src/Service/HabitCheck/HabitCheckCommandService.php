<?php

declare(strict_types=1);

namespace App\Service\HabitCheck;

use App\Dto\HabitCheck\HabitCheckCreateRequest;
use App\Dto\HabitCheck\HabitCheckUpdateRequest;
use App\Entity\HabitCheck;
use App\Normalizer\HabitCheckNormalizer;
use App\Repository\HabitCheckRepository;
use App\Repository\HabitRepository;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class HabitCheckCommandService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly HabitCheckNormalizer $habitCheckNormalizer,
        private readonly HabitCheckRepository $habitCheckRepository,
        private readonly HabitRepository $habitRepository,
        private readonly Security $security
    ) {
    }

    public function create(int $habitId, HabitCheckCreateRequest $habitCheckCreateRequest): array
    {
        $user = $this->security->getUser();

        $habit = $this->habitRepository->findOneBy(['id' => $habitId, 'user' => $user]);
        if ($habit === null) {
            throw new NotFoundHttpException('Habit not found.');
        }

        $habitCheck = (new HabitCheck())
            ->setHabit($habit)
            ->setEntryDate($habitCheckCreateRequest->entryDate)
            ->setValue($habitCheckCreateRequest->value ?? 0.0)
            ->setIsCompleted(
                $habitCheckCreateRequest->isCompleted ?? ($habitCheckCreateRequest->value > 0)
            );

        $this->entityManager->persist($habitCheck);
        $this->entityManager->flush();

        return $this->habitCheckNormalizer->normalize($habitCheck);
    }

    public function update(
        int $id,
        HabitCheckUpdateRequest $habitCheckUpdateRequest
    ): array {
        $user = $this->security->getUser();

        $habitCheck = $this->habitCheckRepository->find($id);

        if ($habitCheck === null) {
            throw new NotFoundHttpException('Habit check not found.');
        }

        if ($habitCheck->getHabit()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You are not allowed to edit this habit check.');
        }

        if ($habitCheckUpdateRequest->value !== null) {
            $habitCheck->setValue($habitCheckUpdateRequest->value);
        }

        if ($habitCheckUpdateRequest->isCompleted !== null) {
            $habitCheck->setIsCompleted($habitCheckUpdateRequest->isCompleted);
        }

        $habitCheck->setUpdatedAt(
            new DateTimeImmutable(
                'now',
                new DateTimeZone('UTC')
            )
        );
        $this->entityManager->flush();

        return $this->habitCheckNormalizer->normalize($habitCheck);
    }

    public function delete(int $id): void
    {
        $user = $this->security->getUser();

        $habitCheck = $this->habitCheckRepository->find($id);

        if ($habitCheck === null) {
            return;
        }

        if ($habitCheck->getHabit()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You are not allowed to delete this habit check.');
        }

        $this->entityManager->remove($habitCheck);
        $this->entityManager->flush();
    }
}
