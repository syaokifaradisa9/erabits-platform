<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorksheetStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'merk' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'identify_number' => 'required|string|max:255',
            'finish_date' => 'required|date',
            'location' => 'required|string|max:255',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:10240', // max 10MB for after maintenance image
            'asset_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:10240', // max 10MB for asset image
            'delete_image' => 'boolean',
            'delete_asset_image' => 'boolean',
            'checklists' => 'required|array',
            'checklists.*.condition' => 'required|string',
            'checklists.*.notes' => 'nullable|string',
            'checklists.*.additional_fix_action' => 'nullable|string',
            'checklists.*.new_repair_status' => 'nullable|string',
            'checklists.*.new_repair_cost_estimate' => 'nullable|numeric',
            'checklists.*.new_repair_notes' => 'nullable|string',
        ];
    }
}
