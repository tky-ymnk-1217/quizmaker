<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            [
                'name' => 'admin',
                'display_name' => 'アプリ管理者',
                'description' => 'アプリのすべてを管理する権限を持つ',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'creator',
                'display_name' => 'クイズ作成者',
                'description' => '自分が作成したクイズのみを管理できる',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
