export function LogoMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M16 1.5l4.1 5.6 6.9-.9-.9 6.9 5.6 4.1-5.6 4.1.9 6.9-6.9-.9L16 30.5l-4.1-5.6-6.9.9.9-6.9L.3 16l5.6-4.1L5 5l6.9.9z" fill="var(--brand)" />
      <path d="M16 9.5l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="var(--saffron)" />
    </svg>
  )
}

export function Logo({ suffix }: { suffix?: string }) {
  return (
    <span className="flex items-center gap-2 font-display text-[25px] font-extrabold tracking-[-0.03em]">
      <LogoMark />dukan
      {suffix && <small className="ml-1 rounded-full border border-line px-2 py-0.5 font-sans text-xs font-semibold tracking-normal text-muted">{suffix}</small>}
    </span>
  )
}
