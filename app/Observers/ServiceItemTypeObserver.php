<?php

namespace App\Observers;

use App\Models\ServiceItemType;
use App\Services\ServiceCategoryCacheService;

class ServiceItemTypeObserver
{
    protected ServiceCategoryCacheService $cacheService;

    public function __construct(ServiceCategoryCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Handle the ServiceItemType "created" event.
     */
    public function created(ServiceItemType $serviceItemType): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the ServiceItemType "updated" event.
     */
    public function updated(ServiceItemType $serviceItemType): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the ServiceItemType "deleted" event.
     */
    public function deleted(ServiceItemType $serviceItemType): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the ServiceItemType "restored" event.
     */
    public function restored(ServiceItemType $serviceItemType): void
    {
        $this->cacheService->clearCache();
    }

    /**
     * Handle the ServiceItemType "force deleted" event.
     */
    public function forceDeleted(ServiceItemType $serviceItemType): void
    {
        $this->cacheService->clearCache();
    }
}