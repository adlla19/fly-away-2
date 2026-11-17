import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { errorMessage } from '../api/errors'
import { AuthCard } from '../components/Layout'
import { Alert, Button, ErrorAlert, TextField } from '../components/ui'

interface LocationState {
  from?: string
  registeredEmail?: string
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = (location.state ?? {}) as LocationState

  const [email, setEmail] = useState(state.registeredEmail ?? '')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Email es obligatorio'
    if (!password) next.password = 'Contraseña es obligatoria'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(state.from ?? '/search', { replace: true })
    } catch (err) {
      const msg = errorMessage(err)
      // El backend responde lo mismo si el email no existe o si la contraseña es incorrecta
      setServerError(msg === 'Username does not exist' ? 'Email o contraseña incorrectos.' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Iniciar sesión" subtitle="Bienvenido de vuelta a Fly Away.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {state.registeredEmail && (
          <Alert variant="success">Cuenta creada. Ya puedes iniciar sesión.</Alert>
        )}
        {searchParams.get('expired') && (
          <Alert variant="info">Tu sesión expiró o no es válida. Vuelve a iniciar sesión.</Alert>
        )}
        {state.from && !searchParams.get('expired') && (
          <Alert variant="info">Inicia sesión para continuar.</Alert>
        )}
        <ErrorAlert messages={serverError ? [serverError] : []} onClose={() => setServerError(null)} />

        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((x) => ({ ...x, email: undefined }))
          }}
          error={errors.email}
        />
        <TextField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((x) => ({ ...x, password: undefined }))
          }}
          error={errors.password}
        />

        <Button type="submit" loading={loading} className="w-full">
          Entrar
        </Button>

        <p className="text-center text-sm text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-violet-700 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
