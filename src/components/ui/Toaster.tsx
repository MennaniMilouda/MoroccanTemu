import { Check, Info, X } from 'lucide-react'
import { useToasts } from '../../store/toast'
import { cn } from './cn'

export function Toaster() {
  const { toasts, dismiss } = useToasts()
  return (
    <div aria-live="polite" className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] left-1/2 z-100 grid w-[min(420px,calc(100%-32px))] -translate-x-1/2 gap-2 md:bottom-[calc(env(safe-area-inset-bottom,0px)+20px)]">
      {toasts.map((t) => {
        const Icon = t.kind === 'error' ? X : t.kind === 'info' ? Info : Check
        return (
          <div key={t.id} className="flex animate-rise items-center gap-2.5 rounded-2xl bg-ink px-3.5 py-3 text-[14.5px] font-medium text-bg shadow-card">
            <span className={cn('grid size-6 flex-none place-items-center rounded-full text-white', t.kind === 'error' ? 'bg-danger' : t.kind === 'info' ? 'bg-brand' : 'bg-ok')}>
              <Icon className="size-3.5" strokeWidth={3} />
            </span>
            <span>{t.message}</span>
            {t.action && (
              <button type="button" className="ml-auto font-bold whitespace-nowrap text-saffron" onClick={() => { t.action!.run(); dismiss(t.id) }}>{t.action.label}</button>
            )}
          </div>
        )
      })}
    </div>
  )
}
