import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/** Redirige a /login si no hay token, recordando a dónde quería ir el usuario. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

/** Para /login y /register: si ya hay sesión, manda a donde iba (o a la búsqueda). */
export function GuestRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/search'
  return isAuthenticated ? <Navigate to={from} replace /> : <Outlet />
}
