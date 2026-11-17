import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { bookFlight, getCurrentUser, searchFlights } from '../api/endpoints'
import { errorMessage } from '../api/errors'
import { FlightsTable } from '../components/FlightsTable'
import { SearchForm } from '../components/SearchForm'
import { Alert, Card, Spinner } from '../components/ui'
import { addBookingId } from '../lib/bookingStorage'
import type { Flight, FlightSearchParams } from '../types'

type BookingResult =
  | { kind: 'success'; bookingId: number; flight: Flight }
  | { kind: 'error'; message: string; flight: Flight }

/** Traduce los errores conocidos del backend, conservando el mensaje original. */
function bookingErrorText(detail: string): string {
  const translations: Record<string, string> = {
    'Cannot book a past flight': 'No se puede reservar un vuelo que ya salió.',
    'Overlapping flight found': 'Ya tienes una reserva cuyo horario se superpone con este vuelo.',
  }
  const es = translations[detail]
  return es ? `${es} (${detail})` : detail
}

export function SearchPage() {
  const { isAuthenticated, user } = useAuth()
  const [params, setParams] = useState<FlightSearchParams>({})
  const [flights, setFlights] = useState<Flight[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)

  const runSearch = useCallback(async (p: FlightSearchParams) => {
    setParams(p)
    setLoading(true)
    setSearchError(null)
    try {
      setFlights(await searchFlights(p))
    } catch (err) {
      setSearchError(errorMessage(err))
      setFlights(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Al entrar, muestra todos los vuelos
  useEffect(() => {
    void runSearch({})
  }, [runSearch])

  const handleBook = async (flight: Flight) => {
    setBookingFlightId(flight.id)
    setBookingResult(null)
    try {
      const bookingId = await bookFlight(flight.id)
      const email = user?.email ?? (await getCurrentUser()).email
      addBookingId(email, bookingId)
      setBookingResult({ kind: 'success', bookingId, flight })
      // Refresca la tabla para mostrar los asientos actualizados
      setFlights(await searchFlights(params))
    } catch (err) {
      setBookingResult({ kind: 'error', message: bookingErrorText(errorMessage(err)), flight })
    } finally {
      setBookingFlightId(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Buscar vuelos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Filtra por número de vuelo, aerolínea y/o rango de fechas de salida. Todos los filtros son opcionales.
        </p>
      </div>

      {bookingResult?.kind === 'success' && (
        <Alert variant="success" title="¡Reserva confirmada!" onClose={() => setBookingResult(null)}>
          Tu reserva del vuelo <strong>{bookingResult.flight.flightNumber}</strong> tiene el ID{' '}
          <strong>#{bookingResult.bookingId}</strong>.{' '}
          <Link to={`/bookings/${bookingResult.bookingId}`} className="font-medium underline">
            Ver detalle
          </Link>
        </Alert>
      )}
      {bookingResult?.kind === 'error' && (
        <Alert
          variant="error"
          title={`No se pudo reservar el vuelo ${bookingResult.flight.flightNumber}`}
          onClose={() => setBookingResult(null)}
        >
          {bookingResult.message}
        </Alert>
      )}

      <SearchForm initial={params} loading={loading} onSearch={runSearch} />

      {!isAuthenticated && (
        <Alert variant="info">
          <Link to="/login" state={{ from: '/search' }} className="font-medium underline">
            Inicia sesión
          </Link>{' '}
          para poder reservar vuelos.
        </Alert>
      )}

      {searchError && <Alert variant="error">{searchError}</Alert>}

      {loading && flights === null ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Spinner /> Buscando vuelos…
        </div>
      ) : flights && flights.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden>
            🛫
          </p>
          <p className="mt-3 font-semibold text-slate-800">No encontramos vuelos con esos filtros</p>
          <p className="mt-1 text-sm text-slate-500">Prueba con otra aerolínea, otro número o amplía el rango de fechas.</p>
        </Card>
      ) : flights ? (
        <>
          <p className="text-sm text-slate-500">
            {flights.length} vuelo{flights.length === 1 ? '' : 's'} encontrado{flights.length === 1 ? '' : 's'}
          </p>
          <FlightsTable
            flights={flights}
            isAuthenticated={isAuthenticated}
            bookingFlightId={bookingFlightId}
            onBook={handleBook}
          />
        </>
      ) : null}
    </div>
  )
}
