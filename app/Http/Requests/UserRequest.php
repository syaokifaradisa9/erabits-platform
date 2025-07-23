<?php

namespace App\Http\Requests;

use App\Enum\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $this->user?->id,
            'phone' => 'required|string|max:20',
            'province' => 'required',
            'city' => 'required',
            'address' => 'nullable|string|max:255',
            'role' => 'required|exists:roles,name',
            'password' => [
                'required',
                Password::min(8)->mixedCase()->numbers()->symbols(),
                'confirmed'
            ],
            'password_confirmation' => 'required_with:password|same:password',
        ];

        if(Auth::user()->hasRole([UserRole::Superadmin, UserRole::Admin])){
            $rules['service_item_type_id'] = 'required|exists:service_item_types,id';
        }

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
            'service_item_type_id.required' => 'Mohon pilih jenis layanan yang sesuai untuk pengguna ini.',
            'service_item_type_id.exists' => 'Jenis layanan yang dipilih tidak valid.',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
            'phone.required' => 'Mohon isikan nomor telepon pengguna terlebih dahulu!',
            'province.required' => 'Mohon isikan provinsi pengguna terlebih dahulu!',
            'city.required' => 'Mohon isikan kota pengguna terlebih dahulu!',
            'address.max' => 'Alamat tidak boleh lebih dari 255 karakter.',
            'password.min' => 'Password harus terdiri dari minimal 8 karakter.',
            'password.mixedCase' => 'Password harus mengandung huruf besar dan kecil.',
            'password.numbers' => 'Password harus mengandung angka.',
            'password.symbols' => 'Password harus mengandung simbol.',
            'role.required' => 'Mohon pilih hak akses pengguna.',
            'role.exists' => 'Hak akses yang dipilih tidak valid.',
            'password_confirmation.required_with' => 'Mohon konfirmasi password jika mengisi password baru.',
        ];
    }
}
