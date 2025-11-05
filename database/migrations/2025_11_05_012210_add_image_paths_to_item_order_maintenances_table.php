<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('item_order_maintenances', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('finish_date');
            $table->string('asset_image_path')->nullable()->after('image_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_order_maintenances', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'asset_image_path']);
        });
    }
};
