<?php

declare(strict_types=1);

namespace App\Dto\Habit;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;
use App\Enum\PeriodType;

class HabitUpdateRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Habit name is required.')]
        #[Assert\Length(
            max: 100,
            maxMessage: 'Habit name cannot exceed {{ limit }} characters.'
        )]
        public readonly string $name,

        #[SerializedName('target_count')]
        #[Assert\NotNull(message: 'Target count is required.')]
        #[Assert\Positive(message: 'Target count must be a positive number.')]
        public readonly int $targetCount,

        #[SerializedName('period_type')]
        #[Assert\NotBlank(message: 'Period type is required.')]
        #[Assert\Choice(
            choices: [PeriodType::Daily->value, PeriodType::Weekly->value, PeriodType::Monthly->value],
            message: 'Period type must be one of: daily, weekly or monthly.'
        )]
        public readonly string $periodType,

        #[SerializedName('period_length')]
        #[Assert\NotNull(message: 'Period length is required.')]
        #[Assert\Positive(message: 'Period length must be a positive number.')]
        public readonly int $periodLength,
    )
    {}
}
