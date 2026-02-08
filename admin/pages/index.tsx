import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 認証チェック
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      // 未ログインの場合、ログインページにリダイレクト
      router.push('/login')
      return
    }

    // ログイン済みの場合、ユーザー情報を取得
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsLoading(false)
    } catch (error) {
      // パースエラーの場合もログインページへ
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    // ローカルストレージをクリア
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    // ログインページにリダイレクト
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // リダイレクト中
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Head>
        <title>ダッシュボード - クイズメーカー管理画面</title>
        <meta name="description" content="クイズメーカーの管理画面" />
      </Head>

      {/* ヘッダー */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
            クイズメーカー管理画面
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{user.name}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{user.role.display_name}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            ダッシュボード
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
            ようこそ、{user.name}さん
          </p>
          
          <div style={{ padding: '48px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '2px dashed #d1d5db' }}>
            <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '8px' }}>
              ダッシュボードは現在開発中です
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              今後、クイズ管理やユーザー管理などの機能が追加される予定です
            </p>
          </div>

          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>クイズ管理</h3>
              <p style={{ fontSize: '14px', color: '#3b82f6' }}>準備中</p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#15803d', marginBottom: '8px' }}>ユーザー管理</h3>
              <p style={{ fontSize: '14px', color: '#22c55e' }}>準備中</p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#faf5ff', borderRadius: '8px', border: '1px solid #f3e8ff' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7c3aed', marginBottom: '8px' }}>統計情報</h3>
              <p style={{ fontSize: '14px', color: '#a855f7' }}>準備中</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
