<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Entity\HabitCheck;

class HabitCheckNormalizer
{
    public function normalize(HabitCheck $habitCheck): array
    {
        return [
            'id' => $habitCheck->getId(),
            'habit_id' => $habitCheck->getHabit()?->getId(),
            'entry_date' => $habitCheck->getEntryDate()?->format('Y-m-d'),
            'is_completed' => $habitCheck->isCompleted(),
            'value' => $habitCheck->getValue(),
            'updated_at' => $habitCheck->getUpdatedAt()->format('Y-m-d H:i:s'),
            'created_at' => $habitCheck->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
