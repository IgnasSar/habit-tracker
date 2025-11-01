<?php

declare(strict_types=1);

namespace App\Service\Habit;

use App\Normalizer\HabitNormalizer;
use App\Repository\HabitRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class HabitQueryService {
    public function __construct(
        private readonly HabitNormalizer $habitNormalizer,
        private readonly HabitRepository $habitRepository,
    ) {}

    public function get(int $id): array
    {
        $habit = $this->habitRepository->findOneById($id);

        if(null === $habit) {
            throw new NotFoundHttpException('Habit not found.');
        }

        return $this->habitNormalizer->normalize($habit);
    }

    public function getAll(int $page, int $limit): array
    {
        $paginator = $this->habitRepository->findAllPaginated($page, $limit);

        $normalized = [];

        foreach ($paginator as $habit) {
            $normalized[] = $this->habitNormalizer->normalize($habit);
        }

        return $normalized;
    }
}
