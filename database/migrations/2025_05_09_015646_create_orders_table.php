<?php

use App\Enum\OrderStatus;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Order from client
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->references('id')->on('users');
            $table->foreignId('reserved_user_id')->nullable()->references('id')->on('users');
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('number')->unique();
            $table->date("confirmation_date")->nullable();
            $table->enum("status", [
                OrderStatus::Pending,
                OrderStatus::Rejected,
                OrderStatus::Confirmed,
                OrderStatus::Finish
            ])->default(OrderStatus::Pending);
            $table->text("notes")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
