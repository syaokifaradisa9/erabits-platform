<?php

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

class UserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $password,
        public string $role
    ) {
    }

    public static function fromAppRequest(Request $request): self
    {
        return new self(
            name: $request->input('name'),
            email: $request->input('email'),
            phone: $request->input('phone'),
            password: $request->input('password'),
            role: $request->input('role'),
        );
    }
}
