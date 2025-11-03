<?php

namespace App\Observers;

use App\Models\Item;
use App\Services\ServiceCategoryCacheService;

class ItemObserver
{
    protected ServiceCategoryCacheService $cacheService;

    public function __construct(ServiceCategoryCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Handle the Item "created" event.
     */
    public function created(Item $item): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the Item "updated" event.
     */
    public function updated(Item $item): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the Item "deleted" event.
     */
    public function deleted(Item $item): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the Item "restored" event.
     */
    public function restored(Item $item): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the Item "force deleted" event.
     */
    public function forceDeleted(Item $item): void
    {
        $this->cacheService->clearCache();
    }
}