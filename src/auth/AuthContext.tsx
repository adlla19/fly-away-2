import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as endpoints from '../api/endpoints'
import { clearToken, getToken, setToken } from '../lib/tokenStorage'
import type { User } from '../types'

interface AuthContextValue {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  /** true mientras se carga el usuario actual al arrancar con un token guardado */
  loadingUser: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState<boolean>(() => Boolean(getToken()))

  // Si al abrir la app ya hay token, recupera el usuario (GET /users/current)
  useEffect(() => {
    if (!token || user) return
    let cancelled = false
    setLoadingUser(true)
    endpoints
      .getCurrentUser()
      .then((u) => !cancelled && setUser(u))
      .catch(() => {
        if (cancelled) return
        clearToken()
        setTokenState(null)
      })
      .finally(() => !cancelled && setLoadingUser(false))
    return () => {
      cancelled = true
    }
  }, [token, user])

  const login = useCallback(async (email: string, password: string) => {
    const newToken = await endpoints.login({ email, password })
    setToken(newToken)
    try {
      const me = await endpoints.getCurrentUser()
      setUser(me)
      setTokenState(newToken)
      return me
    } catch (err) {
      clearToken()
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, isAuthenticated: Boolean(token), loadingUser, login, logout }),
    [token, user, loadingUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
