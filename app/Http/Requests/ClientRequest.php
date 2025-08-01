<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $this->client?->id,
            'phone' => 'required|string|max:20',
            'province' => 'required',
            'city' => 'required',
            'address' => 'nullable|string|max:255',
            'password' => [
                'required',
                Password::min(8)->mixedCase()->numbers()->symbols(),
                'confirmed'
            ],
            'password_confirmation' => 'required_with:password|same:password',
        ];

        if($this->isMethod('put')) {
            unset($rules['password'], $rules['password_confirmation']);
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Mohon isikan nama lengkap pengguna terlebih dahulu!',
            'email.required' => 'Mohon isikan email pengguna terlebih dahulu!',
            'email.email' => 'Mohon isikan email yang valid!',
            'email.unique' => 'Email ini sudah terdaftar, silakan gunakan email lain.',
            'password.required' => 'Mohon isikan password pengguna terlebih dahulu!',
            'password.confirmed' => 'Mohon pastikan password dan konfirmasi password sama.',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
            'phone.required' => 'Mohon isikan nomor telepon pengguna terlebih dahulu!',
            'province.required' => 'Mohon isikan provinsi pengguna terlebih dahulu!',
            'city.required' => 'Mohon isikan kota pengguna terlebih dahulu!',
            'address.max' => 'Alamat tidak boleh lebih dari 255 karakter.',
            'password.min' => 'Password harus terdiri dari minimal 8 karakter.',
            'password.mixedCase' => 'Password harus mengandung huruf besar dan kecil.',
            'password.numbers' => 'Password harus mengandung angka.',
            'password.symbols' => 'Password harus mengandung simbol.',
            'password_confirmation.required_with' => 'Mohon konfirmasi password jika mengisi password baru.',

        ];
    }
}
