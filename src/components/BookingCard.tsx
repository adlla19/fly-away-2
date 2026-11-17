import { Link } from 'react-router-dom'
import { formatDuration, formatShortDate, formatTime } from '../lib/format'
import type { Booking } from '../types'

/** Tarjeta de una reserva, usando el componente "card" de daisyUI. */
export function BookingCard({ booking }: { booking: Booking }) {
  const departed = new Date(booking.estDepartureTime).getTime() < Date.now()

  return (
    <div className="card card-border border-zinc-200 bg-base-100 transition hover:border-violet-300 hover:shadow-md">
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{booking.airlineName}</p>
            <h2 className="card-title font-mono text-2xl text-zinc-900">{booking.flightNumber}</h2>
          </div>
          <span className={`badge badge-sm ${departed ? 'badge-ghost' : 'badge-primary badge-soft'}`}>
            {departed ? 'Completado' : 'Próximo'}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
          <div>
            <p className="text-xs text-zinc-400">Salida</p>
            <p className="text-lg font-semibold tabular-nums text-zinc-900">{formatTime(booking.estDepartureTime)}</p>
            <p className="text-xs text-zinc-500">{formatShortDate(booking.estDepartureTime)}</p>
          </div>
          <div className="flex flex-col items-center text-xs text-zinc-400">
            <span aria-hidden>→</span>
            {formatDuration(booking.estDepartureTime, booking.estArrivalTime)}
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Llegada</p>
            <p className="text-lg font-semibold tabular-nums text-zinc-900">{formatTime(booking.estArrivalTime)}</p>
            <p className="text-xs text-zinc-500">{formatShortDate(booking.estArrivalTime)}</p>
          </div>
        </div>

        <div className="card-actions items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-xs text-zinc-400">Reserva #{booking.id}</span>
          <Link to={`/bookings/${booking.id}`} className="btn btn-primary btn-sm">
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  )
}
