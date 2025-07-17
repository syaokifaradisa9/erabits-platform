<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Item\ItemRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Order\OrderRepository;
use App\Repositories\Item\EloquentItemRepository;
use App\Repositories\User\EloquentUserRepository;
use App\Repositories\Inventory\InventoryRepository;
use App\Repositories\ItemOrder\ItemOrderRepository;
use App\Repositories\Order\EloquentOrderRepository;
use App\Repositories\Consumable\ConsumableRepository;
use App\Repositories\Inventory\EloquentInventoryRepository;
use App\Repositories\InventoryItem\InventoryItemRepository;
use App\Repositories\ItemChecklist\ItemChecklistRepository;
use App\Repositories\ItemOrder\EloquentItemOrderRepository;
use App\Repositories\Consumable\EloquentConsumableRepository;
use App\Repositories\ConsumableItem\ConsumableItemRepository;
use App\Repositories\ClientInventory\ClientInventoryRepository;
use App\Repositories\ServiceItemType\ServiceItemTypeRepository;
use App\Repositories\Consumable\ConsumableTransactionRepository;
use App\Repositories\InventoryItem\EloquentInventoryItemRepository;
use App\Repositories\ItemChecklist\EloquentItemChecklistRepository;
use App\Repositories\ConsumableItem\EloquentConsumableItemRepository;
use App\Repositories\ItemOrderChecklist\ItemOrderChecklistRepository;
use App\Repositories\ClientInventory\EloquentClientInventoryRepository;
use App\Repositories\ItemOrderRefinement\ItemOrderRefinementRepository;
use App\Repositories\ServiceItemType\EloquentServiceItemTypeRepository;
use App\Repositories\Consumable\EloquentConsumableTransactionRepository;
use App\Repositories\ItemOrderMaintenance\ItemOrderMaintenanceRepository;
use App\Repositories\ItemOrderChecklist\EloquentItemOrderChecklistRepository;
use App\Repositories\ItemOrderRefinement\EloquentItemOrderRefinementRepository;
use App\Repositories\ItemOrderMaintenance\EloquentItemOrderMaintenanceRepository;
use App\Repositories\ClientInventoryMaintenance\ClientInventoryMaintenanceRepository;
use App\Repositories\ClientInventoryMaintenance\EloquentClientInventoryMaintenanceRepository;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        App::singleton(ClientInventoryRepository::class, EloquentClientInventoryRepository::class);
        App::singleton(ClientInventoryMaintenanceRepository::class, EloquentClientInventoryMaintenanceRepository::class);
        App::singleton(ConsumableRepository::class, EloquentConsumableRepository::class);
        App::singleton(ConsumableItemRepository::class, EloquentConsumableItemRepository::class);
        App::singleton(InventoryRepository::class, EloquentInventoryRepository::class);
        App::singleton(InventoryItemRepository::class, EloquentInventoryItemRepository::class);
        App::singleton(ItemRepository::class, EloquentItemRepository::class);
        App::singleton(ItemChecklistRepository::class, EloquentItemChecklistRepository::class);
        App::singleton(ItemOrderRepository::class, EloquentItemOrderRepository::class);
        App::singleton(ItemOrderChecklistRepository::class, EloquentItemOrderChecklistRepository::class);
        App::singleton(ItemOrderMaintenanceRepository::class, EloquentItemOrderMaintenanceRepository::class);
        App::singleton(ItemOrderRefinementRepository::class, EloquentItemOrderRefinementRepository::class);
        App::singleton(OrderRepository::class, EloquentOrderRepository::class);
        App::singleton(ServiceItemTypeRepository::class, EloquentServiceItemTypeRepository::class);
        App::singleton(UserRepository::class, EloquentUserRepository::class);
        App::singleton(ConsumableTransactionRepository::class, EloquentConsumableTransactionRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
