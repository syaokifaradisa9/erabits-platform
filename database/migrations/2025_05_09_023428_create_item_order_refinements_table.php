<?php

use App\Enum\ChecklistCondition;
use App\Models\ItemOrder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Refinement if the checklist condition is need to be fixed
        Schema::create('item_order_refinements', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ItemOrder::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();

            $table->date("date");
            $table->string("fix_action");

            $table->text("item_requirements")->nullable();
            $table->boolean("is_item_conditions_are_met")->default(false);

            $table->text("action_requirements")->nullable();
            $table->boolean("is_cation_conditions_are_met")->default(false);

            $table->text("notes")->nullable();
            $table->enum("result", [
                ChecklistCondition::Good,
                ChecklistCondition::Broken,
            ])->default(ChecklistCondition::Broken);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_order_refinements');
    }
};
