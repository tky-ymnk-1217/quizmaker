# クイズメーカー (Quizmaker)

クイズを作成・管理・共有できるウェブアプリケーション

## 📋 プロジェクト構成

- **バックエンド**: PHP 7.4 + Laravel 8.x
- **フロントエンド**: Nuxt.js 2.x
- **管理画面**: Next.js 13.x
- **データベース**: MySQL 8.0
- **Webサーバー**: Nginx
- **コンテナ化**: Docker + Docker Compose

## 🏗️ ディレクトリ構造

```
quizmaker/
├── docker/                  # Docker設定ファイル
│   ├── php/                # PHP-FPM用Dockerfile & php.ini
│   └── nginx/              # Nginx設定ファイル
├── backend/                # Laravel (API)
├── frontend/               # Nuxt.js (ユーザー向けフロントエンド)
├── admin/                  # Next.js (管理画面)
├── docker-compose.yml      # Docker Compose設定
├── setup.bat               # セットアップスクリプト (Windows)
├── setup.sh                # セットアップスクリプト (Linux/Mac)
└── README.md               # このファイル
```

## 🚀 セットアップ方法

### 前提条件

- Docker Desktop がインストールされていること
- Gitがインストールされていること

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd quizmaker/src
```

### 2. Dockerコンテナのビルドと起動

```bash
# Windowsの場合
docker-compose up -d --build

# Linux/Macの場合
docker-compose up -d --build
```

### 3. Laravelのセットアップ

```bash
# Laravelプロジェクトの作成
docker-compose exec backend composer create-project --prefer-dist laravel/laravel:^8.0 .

# .envファイルのコピーと編集
docker-compose exec backend cp .env.example .env

# アプリケーションキーの生成
docker-compose exec backend php artisan key:generate

# データベースマイグレーション
docker-compose exec backend php artisan migrate
```

### 4. フロントエンド（Nuxt.js）のセットアップ

```bash
# frontendディレクトリ内のファイルが既に用意されているので、
# コンテナを再起動して依存関係をインストール
docker-compose restart frontend
```

### 5. 管理画面（Next.js）のセットアップ

```bash
# adminディレクトリ内のファイルが既に用意されているので、
# コンテナを再起動して依存関係をインストール
docker-compose restart admin
```

## 🌐 アクセスURL

セットアップ完了後、以下のURLでアクセスできます：

- **バックエンドAPI**: http://localhost:8000
- **フロントエンド**: http://localhost:3000
- **管理画面**: http://localhost:3001
- **phpMyAdmin**: http://localhost:8080
- **データベース**: localhost:3306

## 🗄️ データベース接続情報

- **ホスト**: db (コンテナ内) / localhost (ホストから)
- **ポート**: 3306
- **データベース名**: quizmaker
- **ユーザー名**: quizmaker
- **パスワード**: password
- **Rootパスワード**: root

## 🛠️ よく使うコマンド

### Dockerコンテナの操作

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose stop

# コンテナの再起動
docker-compose restart

# コンテナの削除
docker-compose down

# ログの確認
docker-compose logs -f [service-name]
```

### Laravelコマンド

```bash
# Artisanコマンドの実行
docker-compose exec backend php artisan [command]

# マイグレーション
docker-compose exec backend php artisan migrate

# マイグレーションのロールバック
docker-compose exec backend php artisan migrate:rollback

# キャッシュのクリア
docker-compose exec backend php artisan cache:clear

# Composerパッケージのインストール
docker-compose exec backend composer install
```

### フロントエンド/管理画面のコマンド

```bash
# Nuxt.js (フロントエンド)
docker-compose exec frontend npm install
docker-compose exec frontend npm run dev

# Next.js (管理画面)
docker-compose exec admin npm install
docker-compose exec admin npm run dev
```

## 📦 主要な機能

### フロントエンド（ユーザー向け）
- クイズの閲覧・検索
- クイズへの挑戦
- スコアの表示
- クイズの作成（登録ユーザー）

### 管理画面
- クイズの管理（CRUD操作）
- ユーザー管理
- 統計情報の確認
- カテゴリ管理

### バックエンドAPI
- RESTful API
- 認証・認可
- データベース操作
- ビジネスロジック

## 🔧 トラブルシューティング

### ポートが既に使用されている場合

docker-compose.ymlのポート番号を変更してください：

```yaml
ports:
  - "8001:80"  # バックエンド (8000から8001に変更)
  - "3002:3000"  # フロントエンド (3000から3002に変更)
  - "3003:3000"  # 管理画面 (3001から3003に変更)
```

### データベース接続エラー

1. データベースコンテナが起動しているか確認
   ```bash
   docker-compose ps
   ```

2. .envファイルのDB設定を確認
   ```
   DB_HOST=db
   DB_DATABASE=quizmaker
   DB_USERNAME=quizmaker
   DB_PASSWORD=password
   ```

### パーミッションエラー（Linux/Mac）

```bash
# Laravelのストレージとキャッシュディレクトリに書き込み権限を付与
docker-compose exec backend chmod -R 777 storage bootstrap/cache
```

## 📝 開発メモ

### PHPバージョンについて
- 現在: PHP 7.4
- 予定: 後ほど最新版（PHP 8.x）に更新予定

### Laravelバージョンについて
- 現在: Laravel 8.x (PHP 7.4対応)
- 予定: 後ほど最新版に更新予定

## 📄 ライセンス

このプロジェクトは私的利用を目的としています。

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

---

**作成日**: 2026年2月8日
