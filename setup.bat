@echo off
chcp 65001 >nul
echo ======================================
echo Quizmaker プロジェクトセットアップ
echo ======================================
echo.

REM バックエンド（Laravel）のセットアップ
echo 1. Laravelバックエンドのセットアップを開始...
if not exist "backend\" (
    echo    Laravelプロジェクトを作成中...
    docker-compose run --rm backend composer create-project --prefer-dist laravel/laravel:^8.0 .
    
    echo    環境変数を設定中...
    docker-compose run --rm backend cp .env.example .env
    
    echo    アプリケーションキーを生成中...
    docker-compose run --rm backend php artisan key:generate
    
    echo ✓ Laravelバックエンドのセットアップが完了しました
) else (
    echo ✓ Laravelバックエンドは既に存在します
)

REM フロントエンド（Nuxt.js）のセットアップ
echo.
echo 2. Nuxt.jsフロントエンドのセットアップを開始...
if not exist "frontend\package.json" (
    echo    Nuxt.jsフロントエンド用ディレクトリを作成中...
    if not exist "frontend\" mkdir frontend
    echo ✓ Nuxt.jsフロントエンド用ディレクトリを作成しました
    echo    注: docker-compose run --rm frontend npx create-nuxt-app . を実行してください
) else (
    echo ✓ Nuxt.jsフロントエンドは既に存在します
)

REM 管理画面（Next.js）のセットアップ
echo.
echo 3. Next.js管理画面のセットアップを開始...
if not exist "admin\package.json" (
    echo    Next.js管理画面用ディレクトリを作成中...
    if not exist "admin\" mkdir admin
    echo ✓ Next.js管理画面用ディレクトリを作成しました
    echo    注: docker-compose run --rm admin npx create-next-app@latest . を実行してください
) else (
    echo ✓ Next.js管理画面は既に存在します
)

echo.
echo ======================================
echo セットアップが完了しました！
echo ======================================
echo.
echo 次のステップ:
echo 1. docker-compose up -d でコンテナを起動
echo 2. バックエンドAPI: http://localhost:8000
echo 3. フロントエンド: http://localhost:3000
echo 4. 管理画面: http://localhost:3001
echo.
pause
