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
        public readonly array $checklists = [],
        public readonly ?object $image = null
    ) {}

    public static function fromAppRequest(ItemRequest $request){
        return new self(
            serviceItemTypeId: $request->service_item_type_id,
            name: $request->name,
            price: $request->price,
            maintenanceCount: $request->maintenance_count,
            checklists: $request->checklists ?? [],
            image: $request->file('image')
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
        // If checklists are not provided or empty, return an empty array.
        if (empty($this->checklists)) {
            return [];
        }

        $checklists = [];
        foreach ($this->checklists as $checklist) {
            // Ensure we only process checklists that have a name.
            if (empty($checklist['name'])) {
                continue;
            }

            $checklists[] = [
                'id' => $checklist['id'] ?? null, // This is the critical fix.
                'name' => $checklist['name'],
                'description' => $checklist['description'] ?? null,
            ];
        }

        return $checklists;
    }
}
