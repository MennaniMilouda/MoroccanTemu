import type { ReactNode } from 'react'
import { cn } from './cn'

type Tone = 'ok' | 'draft' | 'out' | 'warn' | 'brand' | 'instagram' | 'deal'
const tones: Record<Tone, string> = {
  ok: 'bg-ok-soft text-ok',
  draft: 'bg-surface-2 text-muted',
  out: 'bg-danger-soft text-danger',
  warn: 'bg-warn-soft text-warn',
  brand: 'bg-brand-soft text-brand',
  instagram: 'bg-gradient-to-r from-pink-100 to-orange-100 text-pink-800',
  deal: 'bg-deal-soft text-deal',
}

export function Pill({ tone = 'brand', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold whitespace-nowrap [&_svg]:size-3.5', tones[tone], className)}>{children}</span>
}
