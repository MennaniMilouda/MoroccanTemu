import { cn } from './cn'

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-[42px] flex-none rounded-full transition-colors', checked ? 'bg-ok' : 'bg-line')}>
      <span className={cn('absolute top-[3px] left-[3px] size-[18px] rounded-full bg-white shadow transition-transform', checked && 'translate-x-[18px]')} />
    </button>
  )
}
