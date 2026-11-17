import axios from 'axios'

/** Extrae el mensaje legible de un error del backend (ProblemDetail.detail). */
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'No se pudo conectar con el servidor. ¿Está corriendo el backend?'
    const detail = (err.response.data as { detail?: string } | undefined)?.detail
    if (detail) return detail
    if (err.response.status === 403) return 'Necesitas iniciar sesión para hacer esto.'
    if (err.response.status >= 500) return 'Error interno del servidor.'
    return `Error ${err.response.status}`
  }
  return 'Error inesperado'
}

/** Separa un detail con varios errores ("a; b") en una lista. */
export function errorList(err: unknown): string[] {
  return errorMessage(err)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}
