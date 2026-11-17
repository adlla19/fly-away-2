import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

// ---------- Alert ----------

type AlertVariant = 'error' | 'success' | 'info'

const alertStyles: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-violet-200 bg-violet-50 text-violet-800',
}

export function Alert({
  variant,
  title,
  children,
  onClose,
}: {
  variant: AlertVariant
  title?: string
  children?: ReactNode
  onClose?: () => void
}) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${alertStyles[variant]}`}
    >
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="-m-1 rounded p-1 opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  )
}

/** Muestra uno o varios mensajes de error del backend. */
export function ErrorAlert({ messages, onClose }: { messages: string[]; onClose?: () => void }) {
  if (messages.length === 0) return null
  return (
    <Alert variant="error" onClose={onClose}>
      {messages.length === 1 ? (
        messages[0]
      ) : (
        <ul className="list-disc space-y-0.5 pl-4">
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
    </Alert>
  )
}

// ---------- Spinner ----------

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  )
}

// ---------- Button ----------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:outline-violet-600',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400',
  danger: 'text-red-600 hover:bg-red-50 focus-visible:outline-red-500',
}

export function Button({
  variant = 'primary',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

// ---------- TextField ----------

export function TextField({
  label,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; id: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-violet-500 focus:ring-violet-200'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// ---------- Card ----------

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}
