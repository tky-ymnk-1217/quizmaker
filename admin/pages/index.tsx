import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Divider,
} from '@mui/material'
import QuizIcon from '@mui/icons-material/Quiz'
import PeopleIcon from '@mui/icons-material/People'
import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardLayout from '../components/Layout/DashboardLayout'

const Home: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsLoading(false)
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout title="ダッシュボード">
      <Head>
        <title>ダッシュボード - クイズメーカー管理画面</title>
        <meta name="description" content="クイズメーカーの管理画面" />
      </Head>

      <Box 
        sx={{ 
          mb: 4, 
          p: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          ようこそ、{user.name}さん 👋
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          今日も素晴らしいクイズを作成しましょう
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
            onClick={() => router.push('/quizzes')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <QuizIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                    クイズ管理
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    クイズの作成、編集、削除を行えます
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              opacity: 0.7,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'success.main',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'success.light',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    mr: 2,
                  }}
                >
                  <PeopleIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                    ユーザー管理
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    準備中
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              opacity: 0.7,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'warning.main',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'warning.light',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    mr: 2,
                  }}
                >
                  <BarChartIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                    統計情報
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    準備中
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  📊 最近のアクティビティ
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    backgroundColor: 'background.default',
                  }}
                >
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    アクティビティ機能は準備中です
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    今後、クイズの作成履歴や閲覧統計が表示されます
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🎯 クイック アクション
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<QuizIcon />}
                    onClick={() => router.push('/quizzes/create')}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                      },
                    }}
                  >
                    新しいクイズを作成
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<QuizIcon />}
                    onClick={() => router.push('/quizzes')}
                  >
                    クイズ一覧を見る
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  💡 ヒント
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" paragraph>
                  クイズを作成する際は、問題の難易度を適切に設定し、明確な説明を添えることをお勧めします。
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  複数の選択肢を用意することで、より充実したクイズになります。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default Home
