<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\Habit;

class HabitNormalizer
{
    public function normalize(Habit $habit): array
    {
        return [
            'id' => $habit->getId(),
            'name' => $habit->getName(),
            'target_count' => $habit->getTargetCount(),
            'period_type' => $habit->getPeriodType(),
            'period_length' => $habit->getPeriodLength(),
            'updated_at' => $habit->getUpdatedAt()->format('Y-m-d H:i:s'),
            'created_at' => $habit->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
