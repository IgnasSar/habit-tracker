<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\HabitCheckRepository;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HabitCheckRepository::class)]
class HabitCheck
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(
        name: 'entry_date',
        type: 'datetime_immutable'
    )]
    private ?DateTimeImmutable $entryDate = null;

    #[ORM\Column(
        name: 'is_completed',
        type: 'boolean'
    )]
    private bool $isCompleted = false;

    #[ORM\Column(type: 'float')]
    private ?float $value = null;

    #[ORM\Column(
        name: 'updated_at',
        type: 'datetime_immutable'
    )]
    private DateTimeImmutable $updatedAt;

    #[ORM\Column(
        name: 'created_at',
        type: 'datetime_immutable',
        nullable: false
    )]
    private DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(targetEntity: Habit::class, inversedBy: 'habitChecks')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Habit $habit = null;

    public function __construct() {
        $this->updatedAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $this->createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEntryDate(): ?DateTimeImmutable
    {
        return $this->entryDate;
    }

    public function setEntryDate(DateTimeImmutable $entryDate): self
    {
        $this->entryDate = $entryDate;
        return $this;
    }

    public function isCompleted(): bool
    {
        return $this->isCompleted;
    }

    public function setIsCompleted(bool $isCompleted): self
    {
        $this->isCompleted = $isCompleted;
        return $this;
    }

    public function getValue(): ?float
    {
        return $this->value;
    }

    public function setValue(float $value): self
    {
        $this->value = $value;
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

    public function getHabit(): ?Habit
    {
        return $this->habit;
    }

    public function setHabit(Habit $habit): self
    {
        $this->habit = $habit;
        return $this;
    }
}
