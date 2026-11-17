import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { GuestRoute, ProtectedRoute } from './auth/ProtectedRoute'
import { Layout } from './components/Layout'
import { BookingDetailPage } from './pages/BookingDetailPage'
import { LoginPage } from './pages/LoginPage'
import { MyBookingsPage } from './pages/MyBookingsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { SearchPage } from './pages/SearchPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/search" replace />} />

            {/* Públicas: la búsqueda no requiere token (el botón Reservar sí) */}
            <Route path="/search" element={<SearchPage />} />

            {/* Solo para invitados */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protegidas: redirigen a /login si no hay token */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
