import api from './client'
import type {
  Booking,
  Flight,
  FlightSearchParams,
  LoginRequest,
  NewIdResponse,
  RegisterRequest,
  TokenResponse,
  User,
} from '../types'

// ---------- Usuarios / Auth ----------

export async function register(body: RegisterRequest): Promise<NewIdResponse> {
  const { data } = await api.post<NewIdResponse>('/users/register', body)
  return data
}

export async function login(body: LoginRequest): Promise<string> {
  const { data } = await api.post<TokenResponse>('/auth/login', body)
  return data.token
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/users/current')
  return data
}

// ---------- Vuelos ----------

/** Convierte el valor de un datetime-local a ISO-8601 (el backend da 500 con el valor crudo). */
function toIso(value?: string): string | undefined {
  return value ? new Date(value).toISOString() : undefined
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  const { data } = await api.get<{ items: Flight[] }>('/flights/search', {
    params: {
      flightNumber: params.flightNumber?.trim() || undefined,
      airlineName: params.airlineName?.trim() || undefined,
      estDepartureTimeFrom: toIso(params.departureFrom),
      estDepartureTimeTo: toIso(params.departureTo),
    },
  })
  return data.items
}

// ---------- Reservas ----------

export async function bookFlight(flightId: number): Promise<number> {
  const { data } = await api.post<NewIdResponse>('/flights/book', { flightId })
  return data.id
}

export async function getBooking(id: number): Promise<Booking> {
  const { data } = await api.get<Booking>(`/flights/book/${id}`)
  return data
}
