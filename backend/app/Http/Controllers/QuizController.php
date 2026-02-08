<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    /**
     * クイズ一覧取得
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // 管理者は全てのクイズ、作成者は自分のクイズのみ
        $query = Quiz::with('user.role');
        
        if ($user->role->name !== 'admin') {
            $query->where('user_id', $user->id);
        }
        
        $quizzes = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json(['quizzes' => $quizzes], 200);
    }

    /**
     * クイズ作成
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|in:multiple_choice,true_false,text',
            'questions.*.points' => 'nullable|integer|min:1',
            'questions.*.answers' => 'required|array|min:1',
            'questions.*.answers.*.answer_text' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ]);

        try {
            DB::beginTransaction();

            // クイズ作成
            $quiz = Quiz::create([
                'title' => $request->title,
                'description' => $request->description,
                'user_id' => $request->user()->id,
                'is_published' => $request->is_published ?? false,
                'view_count' => 0,
            ]);

            // 問題と選択肢を作成
            foreach ($request->questions as $index => $questionData) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionData['question_text'],
                    'question_type' => $questionData['question_type'],
                    'order' => $index + 1,
                    'points' => $questionData['points'] ?? 10,
                ]);

                foreach ($questionData['answers'] as $answerIndex => $answerData) {
                    Answer::create([
                        'question_id' => $question->id,
                        'answer_text' => $answerData['answer_text'],
                        'is_correct' => $answerData['is_correct'],
                        'order' => $answerIndex + 1,
                    ]);
                }
            }

            DB::commit();

            // 作成したクイズをリレーションと共に取得
            $quiz->load(['questions.answers', 'user.role']);

            return response()->json([
                'message' => 'クイズを作成しました',
                'quiz' => $quiz
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'クイズの作成に失敗しました',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * クイズ詳細取得
     */
    public function show($id)
    {
        $quiz = Quiz::with(['questions.answers', 'user.role'])->findOrFail($id);
        
        return response()->json(['quiz' => $quiz], 200);
    }

    /**
     * クイズ更新
     */
    public function update(Request $request, $id)
    {
        $quiz = Quiz::findOrFail($id);
        $user = $request->user();

        // 権限チェック
        if (!$quiz->canBeEditedBy($user)) {
            return response()->json([
                'message' => 'このクイズを編集する権限がありません'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $quiz->update($request->only(['title', 'description', 'is_published']));

        return response()->json([
            'message' => 'クイズを更新しました',
            'quiz' => $quiz->load(['questions.answers', 'user.role'])
        ], 200);
    }

    /**
     * クイズ削除
     */
    public function destroy(Request $request, $id)
    {
        $quiz = Quiz::findOrFail($id);
        $user = $request->user();

        // 権限チェック
        if (!$quiz->canBeDeletedBy($user)) {
            return response()->json([
                'message' => 'このクイズを削除する権限がありません'
            ], 403);
        }

        $quiz->delete();

        return response()->json([
            'message' => 'クイズを削除しました'
        ], 200);
    }
}
