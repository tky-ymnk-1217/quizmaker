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
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Register: NextPage = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          password_confirmation: passwordConfirmation
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n')
          throw new Error(errorMessages)
        }
        throw new Error(data.message || '登録に失敗しました')
      }

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/')
      
    } catch (err: any) {
      setError(err.message || '登録に失敗しました')
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
        <title>新規登録 - クイズメーカー管理画面</title>
        <meta name="description" content="クイズメーカー 新規ユーザー登録" />
      </Head>

      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <PersonAddIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                クイズメーカー
              </Typography>
              <Typography variant="body1" color="text.secondary">
                クイズ作成者 新規登録
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="名前"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="山田太郎"
                margin="normal"
              />

              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@example.com"
                margin="normal"
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="パスワード（8文字以上）"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                inputProps={{ minLength: 8 }}
                placeholder="••••••••"
                margin="normal"
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                label="パスワード（確認）"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                inputProps={{ minLength: 8 }}
                placeholder="••••••••"
                margin="normal"
                autoComplete="new-password"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="success"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? '登録中...' : '新規登録'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                すでにアカウントをお持ちですか？
              </Typography>
              <Link
                href="/login"
                underline="hover"
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault()
                  router.push('/login')
                }}
              >
                ログインはこちら
              </Link>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, bgcolor: 'info.light' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              登録すると「クイズ作成者」権限が付与されます
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Register
