import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/lib/utils'

interface Props { to: number; prefix?: string; suffix?: string; decimals?: number; duration?: number; className?: string }
export function CountUp({ to, prefix = '', suffix = '', decimals = 0, duration = 1.1, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const last = useRef(0)
  const fmt = (v: number) => `${prefix}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { el.textContent = fmt(to); last.current = to; return }
    const o = { v: last.current }
    const t = gsap.to(o, { v: to, duration, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(o.v) }, onComplete: () => { last.current = to } })
    return () => { t.kill(); last.current = o.v }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to])
  return (
    <>
      <span ref={ref} aria-hidden="true" className={`tabular-nums ${className ?? ''}`}>{fmt(0)}</span>
      <span className="sr-only">{fmt(to)}</span>
    </>
  )
}
