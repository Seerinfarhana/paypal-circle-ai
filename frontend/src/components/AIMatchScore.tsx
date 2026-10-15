import { useRef } from 'react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { CountUp } from './ui/CountUp'
import type { Product } from '@/data/mock'

export function MatchRing({ value, size = 132 }: { value: number; size?: number }) {
  const ring = useRef<SVGCircleElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const r = (size - 14) / 2
  const c = 2 * Math.PI * r
  useGsap((reduced) => {
    gsap.fromTo(ring.current, { strokeDashoffset: c }, { strokeDashoffset: c * (1 - value / 100), duration: reduced ? 0 : 1.3, ease: 'power3.out' })
  }, root, [value])
  return (
    <div ref={root} className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`AI match score ${value} percent`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6EEFB" strokeWidth="10" />
        <circle ref={ring} cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#mr)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c} />
        <defs><linearGradient id="mr" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#001C64" /><stop offset="1" stopColor="#009CDE" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold"><CountUp to={value} suffix="%" /></span>
        <span className="text-xs text-muted">AI Match</span>
      </div>
    </div>
  )
}

export function AIMatchScore({ product }: { product: Product }) {
  const root = useRef<HTMLDivElement>(null)
  useGsap((reduced) => {
    if (reduced) return
    gsap.from('[data-bar]', { width: 0, duration: 1, ease: 'power3.out', stagger: 0.1 })
  }, root, [product.id])
  return (
    <div ref={root} className="flex flex-col items-center gap-6 sm:flex-row">
      <MatchRing value={product.match} />
      <ul className="w-full space-y-3">
        {product.breakdown.map((b) => (
          <li key={b.label}>
            <div className="mb-1 flex justify-between text-sm"><span>{b.label}</span><span className="font-semibold">{b.value}%</span></div>
            <div className="h-2 rounded-full bg-slate-100"><div data-bar className="h-full rounded-full bg-brand" style={{ width: `${b.value}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
