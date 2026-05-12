import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Divider,
  CircularProgress,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import api from '../lib/api'

const Login: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const data = await api.login(email, password)

      if (data.error || !data.token) {
        throw new Error(data.message || 'ログインに失敗しました')
      }

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/')
      
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Head>
        <title>ログイン - クイズメーカー管理画面</title>
        <meta name="description" content="クイズメーカー管理画面ログイン" />
      </Head>

      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                クイズメーカー
              </Typography>
              <Typography variant="body1" color="text.secondary">
                管理画面ログイン
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@quizmaker.co.jp"
                margin="normal"
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                margin="normal"
                autoComplete="current-password"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                アカウントをお持ちでない方
              </Typography>
              <Link
                href="/register"
                underline="hover"
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault()
                  router.push('/register')
                }}
              >
                新規登録はこちら
              </Link>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, bgcolor: 'info.light' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
              デフォルト管理者アカウント
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Email: admin@quizmaker.co.jp / Password: password
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login
