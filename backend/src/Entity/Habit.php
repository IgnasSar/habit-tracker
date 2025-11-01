<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\HabitRepository;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\PeriodType;

#[ORM\Entity(repositoryClass: HabitRepository::class)]
class Habit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 100)]
    private ?string $name = null;

    #[ORM\Column(
        name: 'target_count',
        type: 'integer'
    )]
    private ?int $targetCount = null;

    #[ORM\Column(
        name: 'period_type',
        type: 'string',
        length: 25
    )]
    private string $periodType = PeriodType::Daily->value;

    #[ORM\Column(
        name: 'period_length',
        type: 'integer',
    )]
    private ?int $periodLength = null;

    #[ORM\Column(
        name: 'updated_at',
        type: 'datetime_immutable',
    )]
    private DateTimeImmutable $updatedAt;

    #[ORM\Column(
        name: 'created_at',
        type: 'datetime_immutable',
        nullable: false
    )]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(
        onDelete: 'CASCADE',
        nullable: false
    )]
    private ?User $user = null;

    public function __construct() {
        $this->updatedAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $this->createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getTargetCount(): ?int
    {
        return $this->targetCount;
    }

    public function setTargetCount(int $targetCount): self
    {
        $this->targetCount = $targetCount;
        return $this;
    }

    public function getPeriodType(): PeriodType
    {
        return PeriodType::from($this->periodType);
    }

    public function setPeriodType(PeriodType $periodType): self
    {
        $this->periodType = $periodType->value;
        return $this;
    }

    public function getPeriodLength(): ?int
    {
        return $this->periodLength;
    }

    public function setPeriodLength(int $periodLength): self
    {
        $this->periodLength = $periodLength;
        return $this;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }
}
