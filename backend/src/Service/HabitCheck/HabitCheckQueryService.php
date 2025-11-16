<?php

declare(strict_types=1);

namespace App\Service\HabitCheck;

use App\Normalizer\HabitCheckNormalizer;
use App\Repository\HabitCheckRepository;
use App\Repository\HabitRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class HabitCheckQueryService
{
    public function __construct(
        private readonly HabitCheckNormalizer $habitCheckNormalizer,
        private readonly HabitCheckRepository $habitCheckRepository,
        private readonly HabitRepository $habitRepository,
        private readonly Security $security
    ) {
    }

    public function get(int $id): array
    {
        $user = $this->security->getUser();
        $habitCheck = $this->habitCheckRepository->find($id);

        if ($habitCheck === null) {
            throw new NotFoundHttpException('Habit check not found.');
        }

        if ($habitCheck->getHabit()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to view this habit check.');
        }

        return $this->habitCheckNormalizer->normalize($habitCheck);
    }

    public function findByHabitAndDateRange(int $habitId, ?string $fromDate, ?string $toDate): array
    {
        $user = $this->security->getUser();

        $habit = $this->habitRepository->findOneBy(['id' => $habitId, 'user' => $user]);
        if ($habit === null) {
            throw new NotFoundHttpException('Habit not found.');
        }

        $habitChecks = $this->habitCheckRepository->findChecksByHabitAndDateRange(
            $habitId,
            $fromDate,
            $toDate
        );

        $normalized = [];
        foreach ($habitChecks as $habitCheck) {
            $normalized[] = $this->habitCheckNormalizer->normalize($habitCheck);
        }

        return $normalized;
    }
}
