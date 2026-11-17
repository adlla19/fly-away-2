import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBooking } from '../api/endpoints'
import { errorMessage } from '../api/errors'
import { Alert, Card, Spinner } from '../components/ui'
import { formatDateTime, formatDuration } from '../lib/format'
import type { Booking } from '../types'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-slate-900">{children}</dd>
    </div>
  )
}

export function BookingDetailPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const bookingId = Number(id)
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      setError('ID de reserva inválido')
      return
    }
    let cancelled = false
    getBooking(bookingId)
      .then((b) => !cancelled && setBooking(b))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/bookings" className="text-sm font-medium text-violet-700 hover:underline">
        ← Mis reservas
      </Link>

      {error && (
        <Alert variant="error" title="No se pudo cargar la reserva">
          {error}
        </Alert>
      )}

      {!booking && !error && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Spinner /> Cargando reserva…
        </div>
      )}

      {booking && (
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reserva</p>
              <h1 className="text-2xl font-bold text-slate-900">#{booking.id}</h1>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Confirmada
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 bg-violet-50/60 px-6 py-5">
            <div>
              <p className="text-xs text-slate-500">Salida</p>
              <p className="font-semibold text-slate-900">{formatDateTime(booking.estDepartureTime)}</p>
            </div>
            <div className="text-center text-xs text-slate-500">
              <p className="font-mono text-base font-bold text-violet-700">{booking.flightNumber}</p>
              <p>{formatDuration(booking.estDepartureTime, booking.estArrivalTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Llegada</p>
              <p className="font-semibold text-slate-900">{formatDateTime(booking.estArrivalTime)}</p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100 px-6">
            <Row label="Aerolínea">{booking.airlineName}</Row>
            <Row label="Vuelo">
              {booking.flightNumber} <span className="text-slate-400">(ID {booking.flightId})</span>
            </Row>
            <Row label="Pasajero">
              {booking.customerFirstName} {booking.customerLastName}
            </Row>
            <Row label="Fecha de reserva">{formatDateTime(booking.bookingDate)}</Row>
          </dl>
        </Card>
      )}
    </div>
  )
}
