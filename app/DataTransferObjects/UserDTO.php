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
        public ?string $role,
        public ?string $province,
        public ?string $city,
        public ?string $address,
        public ?int $service_item_type_id
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
            province: $request->input('province'),
            city: $request->input('city'),
            address: $request->input('address'),
            service_item_type_id: $request->input('service_item_type_id')
        );
    }

    public function toArray(): array
    {
        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'province' => $this->province,
            'city' => $this->city,
            'address' => $this->address,
            'service_item_type_id' => $this->service_item_type_id,
        ];

        if($this->password)
        {
            $data['password'] = bcrypt($this->password);
        }
        return $data;
    }
}
