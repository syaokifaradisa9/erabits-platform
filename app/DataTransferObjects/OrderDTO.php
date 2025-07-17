<?php

namespace App\DataTransferObjects;

use App\Http\Requests\OrderRequest;

class OrderDTO
{
    public function __construct(
        public readonly array $items,
    ) {
    }

    public static function fromAppRequest(OrderRequest $request): OrderDTO
    {
        return new self(
            items: collect($request->items)->map(function ($item) {
                return [
                    'id' => $item['id'],
                    'quantity' => $item['quantity']
                ];
            })->toArray()
        );
    }
}
