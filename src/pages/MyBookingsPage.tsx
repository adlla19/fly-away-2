import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getBooking } from '../api/endpoints'
import { BookingCard } from '../components/BookingCard'
import { Card, Spinner } from '../components/ui'
import { getBookingIds } from '../lib/bookingStorage'
import type { Booking } from '../types'

export function MyBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [missing, setMissing] = useState(0)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const ids = getBookingIds(user.email)
    // allSettled ignora los IDs que ya no existen (p. ej. si se reinició el backend)
    Promise.allSettled(ids.map((id) => getBooking(id))).then((results) => {
      if (cancelled) return
      const ok = results
        .filter((r): r is PromiseFulfilledResult<Booking> => r.status === 'fulfilled')
        .map((r) => r.value)
        .sort((a, b) => new Date(a.estDepartureTime).getTime() - new Date(b.estDepartureTime).getTime())
      setBookings(ok)
      setMissing(results.length - ok.length)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis reservas</h1>
        <p className="mt-1 text-sm text-slate-500">Reservas hechas desde este navegador con tu cuenta.</p>
      </div>

      {bookings === null ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Spinner /> Cargando reservas…
        </div>
      ) : bookings.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden>
            🧳
          </p>
          <p className="mt-3 font-semibold text-slate-800">Aún no tienes reservas</p>
          <Link
            to="/search"
            className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Buscar vuelos
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}

      {missing > 0 && (
        <p className="text-xs text-slate-400">
          {missing} reserva{missing === 1 ? '' : 's'} guardada{missing === 1 ? '' : 's'} ya no existe
          {missing === 1 ? '' : 'n'} en el servidor (probablemente se reinició el backend).
        </p>
      )}
    </div>
  )
}
