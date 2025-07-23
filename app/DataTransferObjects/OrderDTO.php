<?php

namespace App\DataTransferObjects;

use App\Enum\UserRole;
use App\Http\Requests\OrderRequest;
use Illuminate\Support\Facades\Auth;

class OrderDTO
{
    public function __construct(
        public readonly int $clientId,
        public readonly array $items,
    ) {
    }

    public static function fromAppRequest(OrderRequest $request): OrderDTO
    {
        return new self(
            clientId: Auth::user()->hasRole(UserRole::Client) ? Auth::user()->id : $request->client_id,
            items: collect($request->items)->map(function ($item) {
                return [
                    'id' => $item['id'],
                    'quantity' => (int) $item['quantity']
                ];
            })->toArray()
        );
    }
}
