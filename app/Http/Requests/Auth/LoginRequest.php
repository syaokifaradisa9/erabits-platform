<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    protected $rules = [
        'email' => 'required|exists:users,email',
        'password' => 'required'
    ];

    protected $messages = [
        'email.required' => 'Mohon isikan email anda terlebih dahulu!',
        'email.exists' => 'Email belum terdaftar!',
        'password.required' => 'Mohon isikan password anda terlebih dahulu!',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->rules;
    }

    public function messages(): array
    {
        return $this->messages;
    }
}
