import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; description?: string; children?: ReactNode; footer?: ReactNode; size?: 'sm' | 'md'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-90 grid place-items-center bg-overlay p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cn('max-h-[calc(100dvh-32px)] w-full animate-rise overflow-auto rounded-[22px] bg-surface shadow-2xl', size === 'sm' ? 'max-w-md' : 'max-w-2xl')}>
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <div>
            <h2 className="text-[23px] font-bold">{title}</h2>
            {description && <p className="mt-1 text-[14.5px] text-muted">{description}</p>}
          </div>
          <IconButton onClick={onClose} aria-label="Fermer"><X className="size-5" /></IconButton>
        </div>
        {children && <div className="grid gap-3.5 px-6 pt-4 pb-6">{children}</div>}
        {footer && <div className="flex flex-wrap justify-end gap-2.5 px-6 pb-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
