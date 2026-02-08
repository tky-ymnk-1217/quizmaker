<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // アプリ管理者のロールIDを取得
        $adminRoleId = DB::table('roles')->where('name', 'admin')->first()->id;
        
        // 管理者ユーザーを作成
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@quizmaker.co.jp',
            'password' => Hash::make('password'), // デフォルトパスワード: password
            'role_id' => $adminRoleId,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
