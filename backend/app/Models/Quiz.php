<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quiz extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'is_published',
        'view_count',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'view_count' => 'integer',
    ];

    /**
     * クイズの作成者
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * クイズの問題
     */
    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    /**
     * 指定されたユーザーがこのクイズを編集できるか
     */
    public function canBeEditedBy(User $user)
    {
        // アプリ管理者はすべてのクイズを編集可能
        if ($user->role && $user->role->isAdmin()) {
            return true;
        }

        // 作成者は自分のクイズのみ編集可能
        return $this->user_id === $user->id;
    }

    /**
     * 指定されたユーザーがこのクイズを削除できるか
     */
    public function canBeDeletedBy(User $user)
    {
        return $this->canBeEditedBy($user);
    }
}
