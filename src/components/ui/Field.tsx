import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from './cn'

export const inputClass = (invalid?: boolean, extra?: string) =>
  cn('w-full rounded-[10px] border bg-surface px-3.5 py-2.5 outline-none transition focus:border-brand focus:ring-3 focus:ring-brand-soft',
    invalid ? 'border-danger ring-3 ring-danger-soft' : 'border-line', extra)

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ invalid, className, ...rest }, ref) => <input ref={ref} aria-invalid={invalid || undefined} className={inputClass(invalid, className)} {...rest} />,
)

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={inputClass(false, className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={inputClass(false, className)} {...rest} />
}

export function Field({ label, htmlFor, error, hint, optional, children, className }: {
  label: string; htmlFor: string; error?: string; hint?: string; optional?: boolean; children: ReactNode; className?: string
}) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label} {optional && <span className="font-medium text-muted">(facultatif)</span>}
      </label>
      {children}
      {error ? <span className="text-[13px] text-danger" role="alert">{error}</span> : hint ? <span className="text-[13px] text-muted">{hint}</span> : null}
    </div>
  )
}
