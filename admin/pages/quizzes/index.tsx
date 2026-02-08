import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const QuizList: NextPage = () => {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchQuizzes()
  }, [router])

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error('クイズの取得に失敗しました', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteQuiz = async (id: number) => {
    if (!confirm('本当にこのクイズを削除しますか？')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`http://localhost:8000/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        fetchQuizzes()
      }
    } catch (error) {
      alert('削除に失敗しました')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Head>
        <title>クイズ一覧 - クイズメーカー</title>
      </Head>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>クイズ一覧</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => router.push('/quizzes/create')} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
              + 新規作成
            </button>
            <button onClick={() => router.push('/')} style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
              戻る
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: '#6b7280' }}>読み込み中...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>クイズがまだありません</p>
            <button onClick={() => router.push('/quizzes/create')} style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
              最初のクイズを作成
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {quizzes.map((quiz: any) => (
              <div key={quiz.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                      {quiz.title}
                    </h3>
                    {quiz.description && (
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                        {quiz.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                      <span>作成者: {quiz.user?.name}</span>
                      <span>問題数: {quiz.questions?.length || 0}問</span>
                      <span>閲覧数: {quiz.view_count}</span>
                      <span style={{ color: quiz.is_published ? '#10b981' : '#ef4444' }}>
                        {quiz.is_published ? '公開中' : '非公開'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => router.push(`/quizzes/${quiz.id}`)}
                      style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      詳細
                    </button>
                    <button 
                      onClick={() => deleteQuiz(quiz.id)}
                      style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default QuizList
