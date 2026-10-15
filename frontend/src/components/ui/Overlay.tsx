import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { gsap } from '@/hooks/useGsap'
import { cn, prefersReducedMotion } from '@/lib/utils'

interface Props { open: boolean; onClose: () => void; title: string; side?: 'center' | 'right' | 'bottom'; children: ReactNode; className?: string; hideTitle?: boolean }

/** Accessible modal / drawer: focus moves in, Esc closes, focus returns on close. */
export function Overlay({ open, onClose, title, side = 'center', children, className, hideTitle }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const key = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    if (!prefersReducedMotion()) {
      gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      const from = side === 'right' ? { x: 48, opacity: 0 } : side === 'bottom' ? { y: 60, opacity: 0 } : { y: 18, scale: 0.97, opacity: 0 }
      gsap.fromTo(panel.current, from, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.3)' })
    }
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [open, side])

  if (!open) return null
  const pos = side === 'right' ? 'items-stretch justify-end' : side === 'bottom' ? 'items-end justify-center' : 'items-center justify-center p-4'
  const shape = side === 'right' ? 'h-full w-full max-w-md rounded-l-xl2' : side === 'bottom' ? 'max-h-[88dvh] w-full rounded-t-xl2' : 'max-h-[90dvh] w-full max-w-xl rounded-xl2'
  return createPortal(
    <div className={cn('fixed inset-0 z-50 flex', pos)}>
      <div ref={scrim} className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
        className={cn('relative flex flex-col overflow-hidden bg-white shadow-float outline-none', shape, className)}>
        <div className={cn('flex items-center justify-between px-5 py-4', hideTitle && 'absolute right-0 top-0 z-10')}>
          {!hideTitle && <h2 className="text-lg font-semibold">{title}</h2>}
          <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-muted hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
