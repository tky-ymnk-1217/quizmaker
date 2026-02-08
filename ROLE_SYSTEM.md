# クイズメーカー 権限システム

## 概要

クイズメーカーには2つのユーザー権限（ロール）が存在します。

## ロール一覧

### 1. アプリ管理者 (admin)

**権限:**
- ✅ すべてのクイズを閲覧
- ✅ すべてのクイズを編集
- ✅ すべてのクイズを削除
- ✅ すべてのユーザーを管理
- ✅ システム設定の変更

**用途:**
アプリケーション全体を管理する責任者が使用します。

### 2. クイズ作成者 (creator)

**権限:**
- ✅ 自分が作成したクイズを閲覧
- ✅ 自分が作成したクイズを編集
- ✅ 自分が作成したクイズを削除
- ✅ 新しいクイズを作成
- ❌ 他のユーザーのクイズは編集不可
- ❌ システム設定の変更不可

**用途:**
クイズを作成・管理するユーザーが使用します。

## データベース構造

### roles テーブル
```
- id: ロールID
- name: ロール名（admin, creator）
- display_name: 表示名（アプリ管理者、クイズ作成者）
- description: 説明
```

### users テーブル
```
- id: ユーザーID
- name: ユーザー名
- email: メールアドレス
- role_id: ロールID（外部キー）
- password: パスワード（ハッシュ化）
```

### quizzes テーブル
```
- id: クイズID
- title: タイトル
- description: 説明
- user_id: 作成者ID（外部キー）
- is_published: 公開状態
- view_count: 閲覧数
```

### questions テーブル
```
- id: 問題ID
- quiz_id: クイズID（外部キー）
- question_text: 問題文
- question_type: 問題タイプ（multiple_choice, true_false, text）
- order: 表示順
- points: 配点
```

### answers テーブル
```
- id: 選択肢ID
- question_id: 問題ID（外部キー）
- answer_text: 選択肢テキスト
- is_correct: 正解フラグ
- order: 表示順
```

## モデルのメソッド

### Userモデル

```php
// ユーザーがアプリ管理者かどうか
$user->isAdmin();

// ユーザーがクイズ作成者かどうか
$user->isCreator();

// 指定されたクイズを編集できるか
$user->canEditQuiz($quiz);

// 指定されたクイズを削除できるか
$user->canDeleteQuiz($quiz);
```

### Quizモデル

```php
// 指定されたユーザーがこのクイズを編集できるか
$quiz->canBeEditedBy($user);

// 指定されたユーザーがこのクイズを削除できるか
$quiz->canBeDeletedBy($user);
```

### Roleモデル

```php
// アプリ管理者のロールかどうか
$role->isAdmin();

// クイズ作成者のロールかどうか
$role->isCreator();
```

## 使用例

### コントローラーでの権限チェック

```php
public function update(Request $request, Quiz $quiz)
{
    $user = auth()->user();
    
    // 編集権限をチェック
    if (!$quiz->canBeEditedBy($user)) {
        return response()->json([
            'message' => 'このクイズを編集する権限がありません'
        ], 403);
    }
    
    // 更新処理
    $quiz->update($request->validated());
    
    return response()->json($quiz);
}
```

### ミドルウェアでの権限チェック

```php
Route::middleware(['auth'])->group(function () {
    // アプリ管理者のみアクセス可能
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
    });
    
    // クイズ作成者もアクセス可能
    Route::post('/quizzes', [QuizController::class, 'store']);
});
```

## 初期データ

システムには以下の2つのロールが初期登録されています：

1. **admin** - アプリ管理者
2. **creator** - クイズ作成者

これらのロールは`RoleSeeder`によって自動的に作成されます。

## セキュリティ

- すべての権限チェックはサーバーサイド（Laravel）で実行されます
- フロントエンドでの権限チェックは表示制御のみで、セキュリティには依存しません
- APIエンドポイントでは必ず権限チェックを実行してください
- パスワードは必ずハッシュ化して保存されます（bcrypt）

## 今後の拡張

必要に応じて、以下のような機能を追加できます：

- ロールごとの詳細な権限設定
- チーム機能（複数人でクイズを共同編集）
- クイズの公開範囲設定
- 閲覧者ロールの追加
- 権限の継承システム

---

**作成日**: 2026年2月8日
