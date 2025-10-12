<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use App\Enum\Role;

class UserUpdateRequest {
    public function __construct(
        #[Assert\Length(
            min: 2,
            max: 50,
            minMessage: 'Username must be at least {{ limit }} characters long.',
            maxMessage: 'Username cannot be longer than {{ limit }} characters.'
        )]
        public readonly ?string $username = null,

        #[Assert\Email(message: 'Please enter a valid email address.')]
        public readonly ?string $email = null,

        #[Assert\Length(
            min: 8,
            minMessage: 'Password must be at least {{ limit }} characters long.'
        )]
        #[Assert\Regex(
            pattern: '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/',
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        )]
        public readonly ?string $password = null,

        #[Assert\Choice(
            choices: [Role::User, Role::Admin],
            message: 'Invalid role. Allowed values: user, admin.'
        )]
        public readonly ?Role $role = null
    ) {}
}
