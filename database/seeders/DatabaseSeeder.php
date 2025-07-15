<?php

namespace Database\Seeders;

use App\Enum\ServiceItemTypeEnum;
use App\Enum\UserRole;
use App\Models\ServiceItemType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach([
            ServiceItemTypeEnum::Alkes,
            ServiceItemTypeEnum::Sarpras,
            ServiceItemTypeEnum::Tech,
            ServiceItemTypeEnum::Otomotive
        ] as $type){
            ServiceItemType::create(['name' => $type]);
        };

        foreach([
            UserRole::Superadmin,
            UserRole::Admin,
            UserRole::Manager,
            UserRole::Client,
            UserRole::Officer,
            UserRole::Finance
        ] as $role){
            Role::create(['name' => $role]);
        }

        User::create([
            'name' => 'SuperAdmin',
            'email' => 'superadmin@eralkes.com',
            'password' => bcrypt('superadmin'),
            'phone' => '081234567890',
            'province' => 'Kalimantan Selatan',
            'city' => 'Banjarbaru',
            'address' => 'Jl. Raya No. 1',
        ])->assignRole(UserRole::Superadmin);

        User::create([
            'name' => 'Client',
            'email' => 'client@gmail.com',
            'password' => bcrypt('client'),
            'phone' => '081234567890',
            'province' => 'Kalimantan Selatan',
            'city' => 'Banjarbaru',
            'address' => 'Jl. Raya No. 1',
        ])->assignRole(UserRole::Client);

        $rolesToSeed = [
            UserRole::Admin,
            UserRole::Manager,
            UserRole::Officer,
            UserRole::Finance,
        ];

        foreach ($rolesToSeed as $role) {
            User::factory()->count(5)->create()->each(function ($user) use ($role) {
                $user->assignRole($role);
            });
        }

        User::factory()->count(5)->create([
            'province' => 'Kalimantan Selatan',
            'city' => 'Banjarbaru',
        ])->each(function ($user) {
            $user->assignRole(UserRole::Client);
        });

        $this->call([ItemSeeder::class]);
        $this->call([ItemChecklistSeeder::class]);
        $this->call([ConsumableSeeder::class]);
        $this->call([InventorySeeder::class]);
    }
}
