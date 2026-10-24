import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from './cn'

type Variant = 'primary' | 'saffron' | 'ghost' | 'soft' | 'danger' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 rounded-full border font-semibold whitespace-nowrap transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-55'
const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-brand text-on-brand hover:bg-brand-strong',
  saffron: 'border-transparent bg-saffron text-on-saffron hover:brightness-95',
  ghost: 'border-line bg-transparent hover:bg-surface-2',
  soft: 'border-transparent bg-brand-soft text-brand hover:brightness-95',
  danger: 'border-transparent bg-danger text-white hover:brightness-95',
  inverse: 'border-white/30 bg-transparent text-white hover:bg-white/10',
}
const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-6 py-3.5 text-[15px]',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cn(base, variants[variant], sizes[size], extra)

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size }

export function Button({ variant, size, className, type = 'button', ...rest }: Props) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />
}

export function ButtonLink({ variant, size, className, ...rest }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />
}

export function IconButton({ className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn('relative inline-grid size-10 place-items-center rounded-full hover:bg-surface-2', className)} {...rest} />
}
