<?php

namespace App\DataTransferObjects;

use App\Http\Requests\Item\ItemRequest;
use Illuminate\Http\Request;

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
            name: $request->name,
            price: $request->price,
            serviceItemTypeId: $request->service_item_type_id,
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
