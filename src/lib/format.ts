const dateTimeFmt = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/** Muestra una fecha ISO-8601 en la zona horaria local del navegador. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : dateTimeFmt.format(d)
}

/** Duración entre dos fechas ISO en formato "3 h 20 min". */
export function formatDuration(fromIso: string, toIso: string): string {
  const minutes = Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000)
  if (!Number.isFinite(minutes) || minutes < 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`
}

const timeFmt = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' })
const shortDateFmt = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })

/** Solo la hora, ej. "15:52". */
export const formatTime = (iso: string): string => timeFmt.format(new Date(iso))

/** Fecha corta, ej. "mié, 18 nov". */
export const formatShortDate = (iso: string): string => shortDateFmt.format(new Date(iso))
