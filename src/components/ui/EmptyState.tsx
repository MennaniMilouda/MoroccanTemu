import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, title, children, actions }: { icon: LucideIcon; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-5 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-muted"><Icon className="size-7" /></span>
      <h3 className="text-xl font-bold">{title}</h3>
      {children && <p className="max-w-[46ch] text-muted">{children}</p>}
      {actions && <div className="mt-1 flex flex-wrap justify-center gap-2.5">{actions}</div>}
    </div>
  )
}
