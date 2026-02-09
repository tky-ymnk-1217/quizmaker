import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import DashboardLayout from '../../components/Layout/DashboardLayout'

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
    <DashboardLayout title="クイズ作成">
      <Head>
        <title>クイズ作成 - クイズメーカー</title>
      </Head>

      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        クイズ作成
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              基本情報
            </Typography>
            
            <TextField
              fullWidth
              label="クイズタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="クイズのタイトルを入力"
              margin="normal"
            />

            <TextField
              fullWidth
              label="説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="クイズの説明を入力"
              margin="normal"
              multiline
              rows={3}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
              }
              label="公開する"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>

        {questions.map((question, qIndex) => (
          <Card key={qIndex} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  問題 {qIndex + 1}
                </Typography>
                {questions.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeQuestion(qIndex)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                label="問題文"
                value={question.question_text}
                onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                required
                placeholder="問題文を入力"
                margin="normal"
                multiline
                rows={2}
              />

              <TextField
                label="配点"
                type="number"
                value={question.points}
                onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                inputProps={{ min: 1 }}
                sx={{ width: 150, mt: 2, mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                選択肢
              </Typography>
              
              {question.answers.map((answer, aIndex) => (
                <Box key={aIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <Checkbox
                    checked={answer.is_correct}
                    onChange={(e) => updateAnswer(qIndex, aIndex, 'is_correct', e.target.checked)}
                    title="正解"
                  />
                  <TextField
                    fullWidth
                    value={answer.answer_text}
                    onChange={(e) => updateAnswer(qIndex, aIndex, 'answer_text', e.target.value)}
                    required
                    placeholder={`選択肢 ${aIndex + 1}`}
                    size="small"
                  />
                  {question.answers.length > 2 && (
                    <IconButton
                      color="error"
                      onClick={() => removeAnswer(qIndex, aIndex)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addAnswer(qIndex)}
                size="small"
                sx={{ mt: 1 }}
              >
                選択肢を追加
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addQuestion}
          fullWidth
          size="large"
          sx={{ mb: 2 }}
        >
          問題を追加
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={<SaveIcon />}
            fullWidth
          >
            {isLoading ? '作成中...' : 'クイズを作成'}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/quizzes')}
          >
            キャンセル
          </Button>
        </Box>
      </form>
    </DashboardLayout>
  )
}

export default QuizCreate
