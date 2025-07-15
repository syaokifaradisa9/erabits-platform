<?php

namespace App\DataTransferObjects;

use App\Http\Requests\Item\ItemRequest;

class ItemDTO
{
    public function __construct(
        public readonly int $serviceItemTypeId,
        public readonly string $name,
        public readonly string $price,
        public readonly int $maintenanceCount,
        public readonly array $checklists = []
    ) {}

    public static function fromAppRequest(ItemRequest $request){
        return new self(
            name: $request->name,
            price: $request->price,
            serviceItemTypeId: $request->service_item_type_id,
            maintenanceCount: $request->maintenance_count,
            checklists: $request->checklists ?? []
        );
    }

    public function toItemArray(): array
    {
        return [
            'service_item_type_id' => $this->serviceItemTypeId,
            'name' => $this->name,
            'price' => $this->price,
            'maintenance_count' => $this->maintenanceCount,
        ];
    }

    public function toChecklistsArray(): array
    {
        $checklists = [];
        foreach($this->checklists as $checklist){
            $checklists[] = [
                'name' => $checklist['name'],
                'description' => $checklist['description'] ?? null,
            ];
        }

        return $checklists;
    }
}
