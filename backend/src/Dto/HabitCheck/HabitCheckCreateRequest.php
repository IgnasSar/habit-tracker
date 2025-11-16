<?php

declare(strict_types=1);

namespace App\Dto\HabitCheck;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;
use DateTimeImmutable;

class HabitCheckCreateRequest
{
    public function __construct(
        #[SerializedName('entry_date')]
        #[Assert\NotBlank(message: 'The entry date is required.')]
        #[Assert\Type(
            type: DateTimeImmutable::class,
            message: 'The entry date must be a valid date in format Y-m-d.'
        )]
        public readonly DateTimeImmutable $entryDate,

        #[Assert\Type(type: 'float')]
        #[Assert\PositiveOrZero(message: 'Value must be a positive number or zero.')]
        public readonly ?float $value = null,

        #[SerializedName('is_completed')]
        #[Assert\Type(type: 'bool')]
        public readonly ?bool $isCompleted = null
    ) {
    }
}
