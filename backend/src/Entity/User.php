<?php

declare(strict_types = 1);

namespace App\Entity;

use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\Role;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

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
    private string $role = Role::User->value;

    #[ORM\Column(
        name: 'last_login',
        type: 'datetime_immutable',
        nullable: true
    )]
    private ?DateTimeImmutable $lastLogin = null;

    #[ORM\Column(
        name: 'created_at',
        type: 'datetime_immutable',
        nullable: false
    )]
    private DateTimeImmutable $createdAt;

    public function __construct() {
        $this->id = Uuid::v4();
        $this->createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public function getId(): ?Uuid
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

    public function getRole(): Role
    {
        return Role::from($this->role);
    }

    public function setRole(Role $role): self
    {
        $this->role = $role->value;
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

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        $roles = ['ROLE_' . strtoupper($this->role)];

        if ($this->role !== Role::User->value) {
            $roles[] = 'ROLE_USER';
        }

        return $roles;
    }

    public function eraseCredentials(): void {}

    public function getPassword(): ?string
    {
        return $this->passwordHash;
    }
}
