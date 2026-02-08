# クイズメーカー セットアップガイド

このドキュメントでは、クイズメーカープロジェクトの詳細なセットアップ手順を説明します。

## 📋 目次

1. [事前準備](#事前準備)
2. [初回セットアップ](#初回セットアップ)
3. [各サービスの詳細設定](#各サービスの詳細設定)
4. [開発環境の確認](#開発環境の確認)
5. [トラブルシューティング](#トラブルシューティング)

## 事前準備

### 必要なソフトウェア

1. **Docker Desktop**
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/

2. **Git**
   - https://git-scm.com/downloads

3. **エディタ（推奨）**
   - Visual Studio Code: https://code.visualstudio.com/

### システム要件

- RAM: 8GB以上推奨
- ストレージ: 10GB以上の空き容量
- OS: Windows 10/11, macOS 10.15以降, Linux

## 初回セットアップ

### ステップ1: プロジェクトの準備

```bash
# プロジェクトディレクトリに移動
cd e:/yt-projects/quizmaker/src

# 現在のファイル構造を確認
dir  # Windowsの場合
ls -la  # Linux/Macの場合
```

### ステップ2: Dockerコンテナのビルド

```bash
# すべてのコンテナをビルドして起動
docker-compose up -d --build

# ビルド状況の確認
docker-compose ps

# ログの確認
docker-compose logs -f
```

**予想される出力:**
```
Creating quizmaker_db              ... done
Creating quizmaker_backend         ... done
Creating quizmaker_nginx_backend   ... done
Creating quizmaker_frontend        ... done
Creating quizmaker_admin           ... done
```

### ステップ3: Laravelバックエンドのセットアップ

```bash
# 1. Laravelプロジェクトの作成（まだ存在しない場合）
docker-compose exec backend composer create-project --prefer-dist laravel/laravel:^8.0 .

# 2. 環境変数ファイルの設定
docker-compose exec backend cp .env.example .env

# 3. .envファイルの編集（既に設定済みの場合はスキップ可）
# 以下の内容を確認・編集してください：
# DB_HOST=db
# DB_DATABASE=quizmaker
# DB_USERNAME=quizmaker
# DB_PASSWORD=password

# 4. アプリケーションキーの生成
docker-compose exec backend php artisan key:generate

# 5. ストレージリンクの作成
docker-compose exec backend php artisan storage:link

# 6. データベースマイグレーション
docker-compose exec backend php artisan migrate

# 7. 初期データのシード（必要に応じて）
# docker-compose exec backend php artisan db:seed
```

### ステップ4: フロントエンド（Nuxt.js）の確認

フロントエンドは自動的にセットアップされますが、問題がある場合：

```bash
# コンテナの再起動
docker-compose restart frontend

# ログの確認
docker-compose logs frontend

# 手動でnpm installを実行する場合
docker-compose exec frontend npm install
```

### ステップ5: 管理画面（Next.js）の確認

管理画面も自動的にセットアップされますが、問題がある場合：

```bash
# コンテナの再起動
docker-compose restart admin

# ログの確認
docker-compose logs admin

# 手動でnpm installを実行する場合
docker-compose exec admin npm install
```

## 各サービスの詳細設定

### バックエンド（Laravel）

#### CORS設定

APIとフロントエンドが異なるポートで動作するため、CORS設定が必要です：

```bash
# Laravel 8の場合、CORS設定ファイルを確認
docker-compose exec backend cat config/cors.php
```

必要に応じて `config/cors.php` を編集：

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

#### APIルートの作成

```bash
# routes/api.phpファイルを編集して、APIエンドポイントを追加
docker-compose exec backend cat routes/api.php
```

サンプルのAPIルート：

```php
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::prefix('quizzes')->group(function () {
    Route::get('/', 'QuizController@index');
    Route::get('/{id}', 'QuizController@show');
    Route::post('/', 'QuizController@store');
    Route::put('/{id}', 'QuizController@update');
    Route::delete('/{id}', 'QuizController@destroy');
});
```

### フロントエンド（Nuxt.js）

#### API接続の確認

`frontend/nuxt.config.js` でAPI URLが正しく設定されているか確認：

```javascript
axios: {
  baseURL: process.env.API_URL || 'http://localhost:8000/api',
},
```

#### ページの追加

```bash
# 新しいページを作成
# frontend/pages/ディレクトリに.vueファイルを追加
```

### 管理画面（Next.js）

#### API接続の確認

`admin/next.config.js` でAPI URLが正しく設定されているか確認：

```javascript
env: {
  API_URL: process.env.API_URL || 'http://localhost:8000/api',
},
```

## 開発環境の確認

### 1. すべてのサービスが起動しているか確認

```bash
docker-compose ps
```

すべてのサービスが "Up" 状態であることを確認してください。

### 2. 各サービスにアクセス

- **バックエンドAPI**: http://localhost:8000
  - テスト: http://localhost:8000/api/test

- **フロントエンド**: http://localhost:3000
  - ブラウザで開いてページが表示されることを確認

- **管理画面**: http://localhost:3001
  - ブラウザで開いてページが表示されることを確認

### 3. データベース接続の確認

```bash
# MySQLコンテナに接続
docker-compose exec db mysql -u quizmaker -ppassword quizmaker

# データベース一覧を表示
SHOW DATABASES;

# テーブル一覧を表示
SHOW TABLES;

# 終了
exit;
```

## トラブルシューティング

### コンテナが起動しない

```bash
# すべてのコンテナを停止
docker-compose down

# ボリュームも含めてすべて削除（データも消えるので注意）
docker-compose down -v

# 再度ビルドと起動
docker-compose up -d --build
```

### ポート競合エラー

エラーメッセージ: "Bind for 0.0.0.0:3000 failed: port is already allocated"

**解決方法**: docker-compose.ymlのポート番号を変更

```yaml
ports:
  - "3002:3000"  # 3000を3002に変更
```

### データベース接続エラー

1. データベースコンテナが起動しているか確認
   ```bash
   docker-compose ps db
   ```

2. データベースログを確認
   ```bash
   docker-compose logs db
   ```

3. バックエンドの.envファイルを確認
   ```bash
   docker-compose exec backend cat .env | grep DB_
   ```

### Laravel: "No application encryption key"

```bash
docker-compose exec backend php artisan key:generate
```

### npm installがハングする

```bash
# コンテナを再起動
docker-compose restart frontend
docker-compose restart admin

# それでも解決しない場合は、node_modulesを削除して再インストール
docker-compose exec frontend sh -c "rm -rf node_modules package-lock.json && npm install"
```

### パーミッションエラー（Linux/Mac）

```bash
# Laravelストレージディレクトリのパーミッション設定
docker-compose exec backend chmod -R 777 storage bootstrap/cache

# または、ホスト側で実行
sudo chown -R $USER:$USER backend/
```

## 次のステップ

セットアップが完了したら：

1. **バックエンド開発**
   - コントローラーとモデルの作成
   - APIエンドポイントの実装
   - データベースマイグレーションの作成

2. **フロントエンド開発**
   - ページコンポーネントの作成
   - API連携の実装
   - UIデザインの実装

3. **管理画面開発**
   - 管理機能の実装
   - ダッシュボードの作成

## サポート

問題が発生した場合は、以下を確認してください：

1. Docker Desktopが起動しているか
2. すべてのコンテナが正常に動作しているか (`docker-compose ps`)
3. ログにエラーがないか (`docker-compose logs -f`)

---

**最終更新**: 2026年2月8日
