<?php

declare(strict_types=1);

namespace App\Service\Habit;

use App\Entity\User;
use App\Normalizer\HabitNormalizer;
use App\Repository\HabitRepository;
use App\Repository\HabitCheckRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class HabitQueryService {
    public function __construct(
        private readonly HabitNormalizer $habitNormalizer,
        private readonly HabitRepository $habitRepository,
        private readonly HabitCheckRepository $habitCheckRepository,
        private readonly Security $security
    ) {}

    public function get(int $id): array
    {
        $habit = $this->habitRepository->findOneById($id);

        if (null === $habit) {
            throw new NotFoundHttpException('Habit not found.');
        }

        $normalized = $this->habitNormalizer->normalize($habit);

        $normalized['current_progress'] = $this->habitCheckRepository
            ->countChecksForCurrentPeriod($habit);

        return $normalized;
    }

    public function getAll(int $page, int $limit): array
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new BadRequestHttpException('Authenticated user not found or invalid.');
        }

        $paginator = $this->habitRepository->findAllPaginatedByUser($page, $limit, $user);

        $normalized = [];

        foreach ($paginator as $habit) {
            $data = $this->habitNormalizer->normalize($habit);

            $data['current_progress'] = $this->habitCheckRepository
                ->countChecksForCurrentPeriod($habit);

            $normalized[] = $data;
        }

        return $normalized;
    }
}
