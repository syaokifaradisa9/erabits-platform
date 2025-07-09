<?php

namespace App\Http\Requests\Common;

use Illuminate\Foundation\Http\FormRequest;

class DatatableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'limit' => 'required|integer|min:5',
        ];
    }
}
