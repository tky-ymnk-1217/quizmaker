# Material-UI Dashboard Integration Guide

## 概要
管理画面にMaterial-UI (MUI)を統合し、モダンでプロフェッショナルなダッシュボードUIを実装しました。

## インストール済みパッケージ
- `@mui/material` - Material-UIのコアコンポーネント
- `@mui/icons-material` - Material-UIのアイコンセット
- `@emotion/react` - MUIの依存関係
- `@emotion/styled` - MUIの依存関係

## 主な変更点

### 1. テーマ設定 (`theme/theme.ts`)
カスタムテーマを作成し、アプリケーション全体で一貫したデザインを提供：
- プライマリカラー: Blue (#1976d2)
- セカンダリカラー: Pink (#dc004e)
- 成功色、警告色、エラー色のカスタマイズ
- ボタンとカードのスタイルオーバーライド

### 2. ダッシュボードレイアウト (`components/Layout/DashboardLayout.tsx`)
- レスポンシブなサイドバーナビゲーション
- トップバーにユーザー情報とアカウントメニュー
- モバイル対応のドロワーメニュー
- Material-UIコンポーネントを使用した洗練されたUI

#### ナビゲーションメニュー
- ダッシュボード (`/`)
- クイズ管理 (`/quizzes`)
- ユーザー管理 (準備中)
- 統計情報 (準備中)

### 3. ページの更新

#### ログイン/登録ページ
- Material-UIのTextField、Button、Cardコンポーネントを使用
- グラデーション背景
- 視覚的に魅力的なフォームデザイン
- エラーメッセージの改善されたAlertコンポーネント

#### ダッシュボード (`pages/index.tsx`)
- カード形式の機能メニュー
- ホバーエフェクト付きのインタラクティブなカード
- アイコンを使った視覚的なナビゲーション

#### クイズ一覧 (`pages/quizzes/index.tsx`)
- Material-UIのCardとChipコンポーネントを使用
- 公開状態、閲覧数などの視覚的な表示
- アイコンボタンによる操作性の向上

#### クイズ作成 (`pages/quizzes/create.tsx`)
- 改善されたフォームレイアウト
- Material-UIのTextField、Checkbox、Buttonを使用
- 動的な問題・選択肢の追加/削除機能
- 視覚的に整理されたフォーム構造

## 使用方法

### 開発サーバーの起動
```bash
cd admin
npm run dev
```

### コンポーネントの使用例

#### DashboardLayoutの使用
```tsx
import DashboardLayout from '../components/Layout/DashboardLayout'

const MyPage = () => {
  return (
    <DashboardLayout title="ページタイトル">
      {/* ページコンテンツ */}
    </DashboardLayout>
  )
}
```

#### Material-UIコンポーネントの使用
```tsx
import { Button, Card, CardContent, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

<Button variant="contained" startIcon={<AddIcon />}>
  追加
</Button>
```

## カスタマイズ

### テーマのカスタマイズ
`theme/theme.ts`ファイルでカラースキーム、フォント、コンポーネントのスタイルをカスタマイズできます。

### レイアウトのカスタマイズ
`components/Layout/DashboardLayout.tsx`でサイドバーの幅、メニュー項目、ヘッダーのコンテンツを変更できます。

## 主な機能

### レスポンシブデザイン
- デスクトップ: 固定サイドバー
- タブレット/モバイル: ドロワーメニュー
- 全画面サイズで最適化されたレイアウト

### アクセシビリティ
- Material-UIのアクセシビリティ機能を活用
- キーボードナビゲーション対応
- ARIAラベルの適切な使用

### パフォーマンス
- Emotionによる効率的なスタイリング
- 必要なコンポーネントのみインポート
- 最適化されたバンドルサイズ

## 今後の拡張

1. **ダークモード対応**
   - テーマ切り替え機能の追加
   
2. **ユーザー管理画面**
   - Material-UIのTableコンポーネントを使用
   
3. **統計情報ダッシュボード**
   - チャートライブラリの統合
   
4. **通知システム**
   - Snackbarコンポーネントの活用

## リソース

- [Material-UI公式ドキュメント](https://mui.com/)
- [Material-UIアイコン一覧](https://mui.com/material-ui/material-icons/)
- [Emotion CSS-in-JS](https://emotion.sh/)
