<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
         // Super Admin (Sami Ayubi)
        $admin = User::firstOrCreate(
            ['email' => 'samiayubi@gmail.com'],
            [
                'name' => 'sami Ayubi',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        $admin->syncRoles(['Super Admin']);

        // Admin (Amina)
        $admin = User::firstOrCreate(
            ['email' => 'iaminabatool13@gmail.com'],
            [
                'name' => 'Amina',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        $admin->syncRoles(['Admin']);

        // Admission Officer (Hidayat)
        $hidayat = User::firstOrCreate(
            ['email' => 'hedayatullahbaizada@gmail.com'],
            [
                'name' => 'Hidayat',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );

        $hidayat->syncRoles(['Admission Officer']);

        // Teacher + Volunteer (Mehdi)
        $mehdi = User::firstOrCreate(
            ['email' => 'mehdi@gmail.com'],
            [
                'name' => 'Mehdi',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );

        $mehdi->syncRoles([
            'Teacher',
            'Volunteer',
        ]);

        // Course Manager (Hassan)
        $hassan = User::firstOrCreate(
            ['email' => 'hassan@gmail.com'],
            [
                'name' => 'Hassan',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );

        $hassan->syncRoles(['Course Manager']);

        // Report Manager (Zulfiqar)
        $zulfiqar = User::firstOrCreate(
            ['email' => 'zulfiqar@gmail.com'],
            [
                'name' => 'Zulfiqar',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );

        $zulfiqar->syncRoles(['Report Manager']);

        // Report Manager (Sharif)
        $sharif = User::firstOrCreate(
            ['email' => 'sharif@gmail.com'],
            [
                'name' => 'Sharif',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );

        $sharif->syncRoles(['Report Manager']);
    }
}