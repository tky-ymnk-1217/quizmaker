<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_type',
        'order',
        'points',
    ];

    protected $casts = [
        'order' => 'integer',
        'points' => 'integer',
    ];

    /**
     * この問題が属するクイズ
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * この問題の選択肢
     */
    public function answers()
    {
        return $this->hasMany(Answer::class)->orderBy('order');
    }

    /**
     * 正解の選択肢
     */
    public function correctAnswer()
    {
        return $this->hasOne(Answer::class)->where('is_correct', true);
    }
}
