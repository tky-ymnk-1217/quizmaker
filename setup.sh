#!/bin/bash

echo "======================================"
echo "Quizmaker プロジェクトセットアップ"
echo "======================================"

# バックエンド（Laravel）のセットアップ
echo ""
echo "1. Laravelバックエンドのセットアップを開始..."
if [ ! -d "./backend" ]; then
    echo "   Laravelプロジェクトを作成中..."
    docker-compose run --rm backend composer create-project --prefer-dist laravel/laravel:^8.0 /var/www/temp
    docker-compose run --rm backend sh -c "cp -r /var/www/temp/. /var/www/backend/ && rm -rf /var/www/temp"
    
    # .envファイルの設定
    echo "   環境変数を設定中..."
    docker-compose run --rm backend cp /var/www/backend/.env.example /var/www/backend/.env
    docker-compose run --rm backend sed -i 's/DB_HOST=127.0.0.1/DB_HOST=db/' /var/www/backend/.env
    docker-compose run --rm backend sed -i 's/DB_DATABASE=laravel/DB_DATABASE=quizmaker/' /var/www/backend/.env
    docker-compose run --rm backend sed -i 's/DB_USERNAME=root/DB_USERNAME=quizmaker/' /var/www/backend/.env
    docker-compose run --rm backend sed -i 's/DB_PASSWORD=/DB_PASSWORD=password/' /var/www/backend/.env
    
    echo "   アプリケーションキーを生成中..."
    docker-compose run --rm backend php /var/www/backend/artisan key:generate
    
    echo "✓ Laravelバックエンドのセットアップが完了しました"
else
    echo "✓ Laravelバックエンドは既に存在します"
fi

# フロントエンド（Nuxt.js）のセットアップ
echo ""
echo "2. Nuxt.jsフロントエンドのセットアップを開始..."
if [ ! -d "./frontend/package.json" ]; then
    echo "   Nuxt.jsプロジェクトを作成中..."
    mkdir -p frontend
    # Nuxt.jsの初期ファイルをコピー（後で手動セットアップが必要）
    echo "✓ Nuxt.jsフロントエンド用ディレクトリを作成しました"
    echo "   注: 'npm init nuxt-app@latest frontend' を実行して手動でセットアップしてください"
else
    echo "✓ Nuxt.jsフロントエンドは既に存在します"
fi

# 管理画面（Next.js）のセットアップ
echo ""
echo "3. Next.js管理画面のセットアップを開始..."
if [ ! -d "./admin/package.json" ]; then
    echo "   Next.jsプロジェクトを作成中..."
    mkdir -p admin
    echo "✓ Next.js管理画面用ディレクトリを作成しました"
    echo "   注: 'npx create-next-app@latest admin' を実行して手動でセットアップしてください"
else
    echo "✓ Next.js管理画面は既に存在します"
fi

echo ""
echo "======================================"
echo "セットアップが完了しました！"
echo "======================================"
echo ""
echo "次のステップ:"
echo "1. docker-compose up -d でコンテナを起動"
echo "2. バックエンドAPI: http://localhost:8000"
echo "3. フロントエンド: http://localhost:3000"
echo "4. 管理画面: http://localhost:3001"
echo ""
