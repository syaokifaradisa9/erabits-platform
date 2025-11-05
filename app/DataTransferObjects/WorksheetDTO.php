<?php

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

class WorksheetDTO
{
    public function __construct(
        public readonly string $merk,
        public readonly string $model,
        public readonly string $identify_number,
        public readonly string $finish_date,
        public readonly ?string $location,
        public readonly array $checklists = [],
        public readonly mixed $image = null,
        public readonly mixed $asset_image = null,
        public readonly ?bool $delete_image = false,
        public readonly ?bool $delete_asset_image = false
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            merk: $request->input('merk'),
            model: $request->input('model'),
            identify_number: $request->input('identify_number'),
            finish_date: $request->input('finish_date'),
            location: $request->input('location'),
            checklists: $request->input('checklists', []),
            image: $request->file('image'),
            asset_image: $request->file('asset_image'),
            delete_image: $request->input('delete_image', false),
            delete_asset_image: $request->input('delete_asset_image', false)
        );
    }

    public function toItemOrderArray(): array
    {
        return [
            'merk' => $this->merk,
            'model' => $this->model,
            'identify_number' => $this->identify_number,
        ];
    }

    public function toClientInventoryArray(): array
    {
        return [
            'merk' => $this->merk,
            'model' => $this->model,
            'last_maintenance_date' => $this->finish_date,
        ];
    }
}
