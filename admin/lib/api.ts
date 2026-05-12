// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api'

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

/**
 * API fetch wrapper with authentication
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint}`
  
  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * API Client methods
 */
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  register: async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    })
    return response.json()
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await apiFetch('/quizzes')
    return response.json()
  },

  getQuiz: async (id: number) => {
    const response = await apiFetch(`/quizzes/${id}`)
    return response.json()
  },

  createQuiz: async (quizData: any) => {
    const response = await apiFetch('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    })
    return response.json()
  },

  updateQuiz: async (id: number, quizData: any) => {
    const response = await apiFetch(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    })
    return response.json()
  },

  deleteQuiz: async (id: number) => {
    const response = await apiFetch(`/quizzes/${id}`, {
      method: 'DELETE',
    })
    return response
  },
}

export default api
