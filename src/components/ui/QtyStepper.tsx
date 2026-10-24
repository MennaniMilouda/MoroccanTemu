import { Minus, Plus } from 'lucide-react'

export function QtyStepper({ value, onChange, min = 1, max = 10, label = 'Quantité' }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string
}) {
  const btn = 'grid size-9.5 place-items-center rounded-full hover:bg-surface-2 disabled:opacity-40'
  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-line bg-surface" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Diminuer"><Minus className="size-4" /></button>
      <span className="min-w-7 text-center font-bold tabular-nums">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Augmenter"><Plus className="size-4" /></button>
    </div>
  )
}
