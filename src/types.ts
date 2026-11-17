export interface RegisterRequest {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  token: string
}

export interface NewIdResponse {
  id: number
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface Flight {
  id: number
  flightNumber: string
  airlineName: string
  estDepartureTime: string
  estArrivalTime: string
  availableSeats: number
}

export interface FlightSearchParams {
  flightNumber?: string
  airlineName?: string
  /** Valor crudo de un <input type="datetime-local"> (puede estar vacío) */
  departureFrom?: string
  /** Valor crudo de un <input type="datetime-local"> (puede estar vacío) */
  departureTo?: string
}

export interface Booking {
  id: number
  bookingDate: string
  flightId: number
  flightNumber: string
  airlineName: string
  estDepartureTime: string
  estArrivalTime: string
  customerId: number
  customerFirstName: string
  customerLastName: string
}
