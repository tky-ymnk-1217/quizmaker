<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * ユーザーのロール
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * ユーザーが作成したクイズ
     */
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    /**
     * アプリ管理者かどうか
     */
    public function isAdmin()
    {
        return $this->role && $this->role->isAdmin();
    }

    /**
     * クイズ作成者かどうか
     */
    public function isCreator()
    {
        return $this->role && $this->role->isCreator();
    }

    /**
     * 指定されたクイズを編集できるか
     */
    public function canEditQuiz(Quiz $quiz)
    {
        return $quiz->canBeEditedBy($this);
    }

    /**
     * 指定されたクイズを削除できるか
     */
    public function canDeleteQuiz(Quiz $quiz)
    {
        return $quiz->canBeDeletedBy($this);
    }
}
