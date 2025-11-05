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
        Schema::table('client_inventories', function (Blueprint $table) {
            $table->string('customer_image_path')->nullable()->after('last_maintenance_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_inventories', function (Blueprint $table) {
            $table->dropColumn('customer_image_path');
        });
    }
};
