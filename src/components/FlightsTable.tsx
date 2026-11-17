import { Link } from 'react-router-dom'
import { formatDateTime, formatDuration } from '../lib/format'
import type { Flight } from '../types'
import { Button } from './ui'

interface Props {
  flights: Flight[]
  isAuthenticated: boolean
  bookingFlightId: number | null
  onBook: (flight: Flight) => void
}

export function FlightsTable({ flights, isAuthenticated, bookingFlightId, onBook }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Número</th>
            <th className="px-4 py-3">Aerolínea</th>
            <th className="px-4 py-3">Salida</th>
            <th className="px-4 py-3">Llegada</th>
            <th className="px-4 py-3 text-right">Asientos</th>
            <th className="px-4 py-3 text-right">
              <span className="sr-only">Acción</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {flights.map((f) => {
            const departed = new Date(f.estDepartureTime).getTime() < Date.now()
            return (
              <tr key={f.id} className="hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-slate-900">
                  {f.flightNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{f.airlineName}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatDateTime(f.estDepartureTime)}
                  {departed && (
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                      ya salió
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatDateTime(f.estArrivalTime)}
                  <span className="block text-xs text-slate-400">
                    {formatDuration(f.estDepartureTime, f.estArrivalTime)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                  <span className={f.availableSeats === 0 ? 'text-red-600' : ''}>{f.availableSeats}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {isAuthenticated ? (
                    <Button
                      onClick={() => onBook(f)}
                      loading={bookingFlightId === f.id}
                      disabled={bookingFlightId !== null}
                      className="px-3 py-1.5"
                    >
                      Reservar
                    </Button>
                  ) : (
                    <Link
                      to="/login"
                      state={{ from: '/search' }}
                      className="text-xs font-medium text-violet-700 hover:underline"
                    >
                      Inicia sesión para reservar
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
