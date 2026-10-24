import { cn } from './cn'

export const Spinner = ({ className }: { className?: string }) => (
  <span className={cn('inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)} aria-hidden="true" />
)
