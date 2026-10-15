import { cn } from '@/lib/utils'

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="12" cy="16" r="9" fill="#001C64" />
      <circle cx="20" cy="16" r="9" fill="#0070E0" fillOpacity=".88" />
      <path d="M16 9.3a9 9 0 0 1 0 13.4 9 9 0 0 1 0-13.4Z" fill="#009CDE" />
    </svg>
  )
}

export function Logo({ compact, light, className }: { compact?: boolean; light?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {!compact && (
        <span className={cn('text-[17px] font-semibold leading-none', light ? 'text-white' : 'text-navy')}>
          PayPal <span className={light ? 'text-sky' : 'text-brand'}>Circle AI</span>
        </span>
      )}
    </span>
  )
}
