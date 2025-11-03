<?php

namespace App\Http\Requests\Item;

use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_item_type_id' => 'required|exists:service_item_types,id',
            'name' => 'required',
            'price' => 'required|numeric|min:0',
            'maintenance_count' => 'required|integer|min:0',
            'checklists' => 'array',
            'checklists.*.name' => 'required|string',
            'checklists.*.description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }

    public function messages(){
        return [
            "service_item_type_id.required" => "Mohon pilih jenis layanan terlebih dahulu!",
            "service_item_type_id.exists" => "Jenis layanan yang dipilih tidak valid!",
            "name.required" => "Mohon isikan nama item maintenance terlebih dahulu!",
            "price.required" => "Mohon isikan harga item maintenance terlebih dahulu!",
            "price.numeric" => "Harga item maintenance harus berupa angka!",
            "price.min" => "Harga item maintenance tidak boleh kurang dari 0!",
            "maintenance_count.required" => "Mohon isikan jumlah maintenance terlebih dahulu!",
            "maintenance_count.integer" => "Jumlah maintenance harus berupa angka!",
            "maintenance_count.min" => "Jumlah maintenance tidak boleh kurang dari 0!",
            "checklists.array" => "Checklist harus berupa array!",
            "checklists.*.name.required" => "Mohon isikan nama checklist!",
            "checklists.*.description.string" => "Deskripsi checklist harus berupa string!",
        ];
    }
}
