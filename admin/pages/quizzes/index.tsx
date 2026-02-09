import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DashboardLayout from '../../components/Layout/DashboardLayout'

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
    <DashboardLayout title="クイズ一覧">
      <Head>
        <title>クイズ一覧 - クイズメーカー</title>
      </Head>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          クイズ一覧
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/quizzes/create')}
          size="large"
        >
          新規作成
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              クイズがまだありません
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/quizzes/create')}
              sx={{ mt: 2 }}
            >
              最初のクイズを作成
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {quizzes.map((quiz: any) => (
            <Card key={quiz.id} sx={{ transition: 'all 0.3s', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                      {quiz.title}
                    </Typography>
                    {quiz.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {quiz.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={`作成者: ${quiz.user?.name}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`問題数: ${quiz.questions?.length || 0}問`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`閲覧数: ${quiz.view_count}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={quiz.is_published ? '公開中' : '非公開'}
                        size="small"
                        color={quiz.is_published ? 'success' : 'error'}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/quizzes/${quiz.id}`)}
                      title="詳細"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteQuiz(quiz.id)}
                      title="削除"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </DashboardLayout>
  )
}

export default QuizList
