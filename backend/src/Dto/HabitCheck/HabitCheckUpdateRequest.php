<?php

declare(strict_types=1);

namespace App\Dto\HabitCheck;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\SerializedName;

class HabitCheckUpdateRequest
{
    public function __construct(
        #[Assert\Type(type: 'float')]
        #[Assert\PositiveOrZero(message: 'Value must be a positive number or zero.')]
        public readonly ?float $value = null,

        #[SerializedName('is_completed')]
        #[Assert\Type(type: 'bool')]
        public readonly ?bool $isCompleted = null
    ) {
    }
}
