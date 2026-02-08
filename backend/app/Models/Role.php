<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * このロールを持つユーザー
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * アプリ管理者かどうか
     */
    public function isAdmin()
    {
        return $this->name === 'admin';
    }

    /**
     * クイズ作成者かどうか
     */
    public function isCreator()
    {
        return $this->name === 'creator';
    }
}
