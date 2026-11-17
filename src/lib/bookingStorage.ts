// No existe endpoint para listar reservas: guardamos los IDs en localStorage, separados por usuario.
const keyFor = (email: string) => `bookings:${email}`

export function getBookingIds(email: string): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(keyFor(email)) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

export function addBookingId(email: string, id: number): void {
  const ids = getBookingIds(email)
  if (!ids.includes(id)) localStorage.setItem(keyFor(email), JSON.stringify([...ids, id]))
}

export function removeBookingId(email: string, id: number): void {
  localStorage.setItem(keyFor(email), JSON.stringify(getBookingIds(email).filter((x) => x !== id)))
}
