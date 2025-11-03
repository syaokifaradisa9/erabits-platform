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
        Schema::table('item_order_checklists', function (Blueprint $table) {
            $table->string('repair_status')->nullable()->after('notes'); // pending, in_progress, completed, declined
            $table->decimal('repair_cost_estimate', 15, 2)->nullable()->after('repair_status'); // estimasi biaya perbaikan
            $table->text('repair_notes')->nullable()->after('repair_cost_estimate'); // catatan perbaikan
            $table->timestamp('repair_started_at')->nullable()->after('repair_notes'); // tanggal mulai perbaikan
            $table->timestamp('repair_completed_at')->nullable()->after('repair_started_at'); // tanggal selesai perbaikan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_order_checklists', function (Blueprint $table) {
            $table->dropColumn([
                'repair_status',
                'repair_cost_estimate',
                'repair_notes',
                'repair_started_at',
                'repair_completed_at'
            ]);
        });
    }
};
