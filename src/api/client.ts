import axios from 'axios'
import { clearToken, getToken } from '../lib/tokenStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

// Adjunta el JWT a cada solicitud si existe
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// El backend responde 403 (no 401) cuando el token falta o es inválido.
// Si enviamos un token y recibimos 403, el token ya no sirve: cerramos sesión.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 403 && sentToken) {
      clearToken()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1'
      }
    }
    return Promise.reject(error)
  },
)

export default api
