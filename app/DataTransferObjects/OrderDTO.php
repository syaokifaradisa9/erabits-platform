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
            items: $request->validated("items"),
        );
    }
}
