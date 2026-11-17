import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/endpoints'
import { errorList } from '../api/errors'
import { AuthCard } from '../components/Layout'
import { Alert, Button, ErrorAlert, TextField } from '../components/ui'
import type { RegisterRequest } from '../types'

type Field = keyof RegisterRequest
const EMPTY: RegisterRequest = { email: '', firstName: '', lastName: '', password: '' }

const LABELS: Record<Field, string> = {
  email: 'Email',
  firstName: 'Nombre',
  lastName: 'Apellido',
  password: 'Contraseña',
}

/** Validación local: solo campos vacíos (las reglas de negocio las valida el backend). */
function validateEmpty(form: RegisterRequest): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  for (const field of Object.keys(LABELS) as Field[]) {
    if (!form[field].trim()) errors[field] = `${LABELS[field]}: campo obligatorio`
  }
  return errors
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterRequest>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({})
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Tras registrarse con éxito, redirige al login
  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => navigate('/login', { state: { registeredEmail: form.email.trim() } }), 1800)
    return () => clearTimeout(t)
  }, [success, navigate, form.email])

  const update = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setFieldErrors((errs) => ({ ...errs, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerErrors([])

    const errors = validateEmpty(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      await register({ ...form, email: form.email.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim() })
      setSuccess(true)
    } catch (err) {
      setServerErrors(errorList(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Crear cuenta" subtitle="Regístrate para reservar vuelos con Fly Away.">
      {success ? (
        <Alert variant="success" title="¡Cuenta creada con éxito!">
          Te estamos llevando al inicio de sesión…{' '}
          <Link to="/login" className="font-medium underline">
            Ir ahora
          </Link>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <ErrorAlert messages={serverErrors} onClose={() => setServerErrors([])} />

          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={update('email')}
            error={fieldErrors.email}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="firstName"
              label="Nombre"
              autoComplete="given-name"
              placeholder="Ana"
              value={form.firstName}
              onChange={update('firstName')}
              error={fieldErrors.firstName}
            />
            <TextField
              id="lastName"
              label="Apellido"
              autoComplete="family-name"
              placeholder="García"
              value={form.lastName}
              onChange={update('lastName')}
              error={fieldErrors.lastName}
            />
          </div>
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            error={fieldErrors.password}
          />
          <p className="-mt-2 text-xs text-slate-500">
            Mínimo 8 caracteres, con al menos una mayúscula y un dígito. Nombre y apellido deben empezar con mayúscula.
          </p>

          <Button type="submit" loading={loading} className="w-full">
            Registrarme
          </Button>

          <p className="text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-violet-700 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  )
}
