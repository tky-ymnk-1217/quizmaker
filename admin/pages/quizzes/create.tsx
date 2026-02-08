import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface Answer {
  answer_text: string
  is_correct: boolean
}

interface Question {
  question_text: string
  question_type: string
  points: number
  answers: Answer[]
}

const QuizCreate: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([
    {
      question_text: '',
      question_type: 'multiple_choice',
      points: 10,
      answers: [
        { answer_text: '', is_correct: true },
        { answer_text: '', is_correct: false }
      ]
    }
  ])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      question_type: 'multiple_choice',
      points: 10,
      answers: [
        { answer_text: '', is_correct: true },
        { answer_text: '', is_correct: false }
      ]
    }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const addAnswer = (questionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].answers.push({ answer_text: '', is_correct: false })
    setQuestions(updated)
  }

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].answers = updated[questionIndex].answers.filter((_, i) => i !== answerIndex)
    setQuestions(updated)
  }

  const updateAnswer = (questionIndex: number, answerIndex: number, field: string, value: any) => {
    const updated = [...questions]
    updated[questionIndex].answers[answerIndex] = {
      ...updated[questionIndex].answers[answerIndex],
      [field]: value
    }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          is_published: isPublished,
          questions
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'クイズの作成に失敗しました')
      }

      router.push('/quizzes')
    } catch (err: any) {
      setError(err.message || 'クイズの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Head>
        <title>クイズ作成 - クイズメーカー</title>
      </Head>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>クイズ作成</h1>
          <button onClick={() => router.push('/')} style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
            戻る
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>基本情報</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                クイズタイトル *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="クイズのタイトルを入力"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                説明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="クイズの説明を入力"
                rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="is_published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="is_published" style={{ fontSize: '14px', color: '#374151' }}>
                公開する
              </label>
            </div>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>問題 {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} style={{ padding: '4px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    削除
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  問題文 *
                </label>
                <textarea
                  value={question.question_text}
                  onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                  required
                  placeholder="問題文を入力"
                  rows={2}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  配点
                </label>
                <input
                  type="number"
                  value={question.points}
                  onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                  min="1"
                  style={{ width: '120px', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  選択肢
                </label>
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={answer.is_correct}
                      onChange={(e) => updateAnswer(qIndex, aIndex, 'is_correct', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                      title="正解"
                    />
                    <input
                      type="text"
                      value={answer.answer_text}
                      onChange={(e) => updateAnswer(qIndex, aIndex, 'answer_text', e.target.value)}
                      required
                      placeholder={`選択肢 ${aIndex + 1}`}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    />
                    {question.answers.length > 2 && (
                      <button type="button" onClick={() => removeAnswer(qIndex, aIndex)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                        削除
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addAnswer(qIndex)} style={{ padding: '6px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}>
                  + 選択肢を追加
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addQuestion} style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', marginBottom: '16px' }}>
            + 問題を追加
          </button>

          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>
              <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: isLoading ? '#9ca3af' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            {isLoading ? '作成中...' : 'クイズを作成'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default QuizCreate
