import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/search" className="mr-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900">
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-sm text-white">
            ✈
          </span>
          Fly Away
        </Link>

        <NavLink to="/search" className={linkClass}>
          Buscar vuelos
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/bookings" className={linkClass}>
            Mis reservas
          </NavLink>
        )}

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {user && (
                <span className="hidden text-sm text-slate-600 sm:inline">
                  Hola, <strong className="text-slate-900">{user.firstName} {user.lastName}</strong>
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Iniciar sesión
              </NavLink>
              <Link
                to="/register"
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
