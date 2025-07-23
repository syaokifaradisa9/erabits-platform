<?php

namespace App\Http\Requests;

use App\Enum\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'items' => 'required|array',
            'items.*.id' => 'required|exists:items,id',
        ];

        if(Auth::user()->hasRole([UserRole::Superadmin, UserRole::Admin, UserRole::Manager])){
            $rules['client_id'] = 'required|exists:users,id';
        }

        return $rules;
    }
}
