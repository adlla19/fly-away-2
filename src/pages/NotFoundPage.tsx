import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <p className="text-5xl font-bold text-violet-600">404</p>
      <p className="mt-2 text-slate-600">Esta página no existe.</p>
      <Link to="/search" className="mt-6 inline-block font-medium text-violet-700 hover:underline">
        Volver a la búsqueda
      </Link>
    </div>
  )
}
