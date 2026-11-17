import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { FlightSearchParams } from '../types'
import { Button, TextField } from './ui'

interface Props {
  initial: FlightSearchParams
  loading: boolean
  onSearch: (params: FlightSearchParams) => void
}

const EMPTY: FlightSearchParams = { flightNumber: '', airlineName: '', departureFrom: '', departureTo: '' }

export function SearchForm({ initial, loading, onSearch }: Props) {
  const [values, setValues] = useState<FlightSearchParams>({ ...EMPTY, ...initial })
  const [rangeError, setRangeError] = useState<string | undefined>()

  const set = (key: keyof FlightSearchParams) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setRangeError(undefined)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const { departureFrom, departureTo } = values
    if (departureFrom && departureTo && new Date(departureFrom) > new Date(departureTo)) {
      setRangeError('La fecha "desde" debe ser anterior a la fecha "hasta"')
      return
    }
    onSearch(values)
  }

  const handleClear = () => {
    setValues(EMPTY)
    setRangeError(undefined)
    onSearch(EMPTY)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <TextField
        id="flightNumber"
        label="Número de vuelo"
        placeholder="LA101"
        value={values.flightNumber}
        onChange={set('flightNumber')}
      />
      <TextField
        id="airlineName"
        label="Aerolínea"
        placeholder="LATAM"
        value={values.airlineName}
        onChange={set('airlineName')}
      />
      <TextField
        id="departureFrom"
        label="Salida desde"
        type="datetime-local"
        value={values.departureFrom}
        onChange={set('departureFrom')}
        error={rangeError}
      />
      <TextField
        id="departureTo"
        label="Salida hasta"
        type="datetime-local"
        value={values.departureTo}
        onChange={set('departureTo')}
      />
      <div className="flex gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
        <Button type="button" variant="secondary" onClick={handleClear} disabled={loading}>
          Limpiar
        </Button>
        <Button type="submit" loading={loading}>
          Buscar vuelos
        </Button>
      </div>
    </form>
  )
}
