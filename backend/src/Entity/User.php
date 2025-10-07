<?php

declare(strict_types = 1);

namespace App\Entity;

use App\Repository\UserRepository;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(
        type: 'string',
        length: 50,
        unique: true,
        nullable: false
    )]
    private ?string $username = null;

    #[ORM\Column(
        type: 'string',
        length: 255,
        unique: true,
        nullable: false
    )]
    private ?string $email = null;

    #[ORM\Column(
        name: 'password_hash',
        type: 'string',
        length: 255,
        nullable: false
    )]
    private ?string $passwordHash = null;

    #[ORM\Column(
        type: 'string',
        length: 25,
        nullable: false
    )]
    private string $role = 'user';

    #[ORM\Column(
        name: 'last_login',
        type: 'datetime_immutable'
    )]
    private ?DateTimeImmutable $lastLogin = null;

    #[ORM\Column(
        name: 'created_at',
        type: 'datetime_immutable',
        nullable: false
    )]
    private DateTimeImmutable $createdAt;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPasswordHash(): ?string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(string $passwordHash): self
    {
        $this->passwordHash = $passwordHash;
        return $this;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;
        return $this;
    }

    public function getLastLogin(): ?DateTimeImmutable
    {
        return $this->lastLogin;
    }

    public function setLastLogin(DateTimeImmutable $lastLogin): self
    {
        $this->lastLogin = $lastLogin;
        return $this;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }
}
