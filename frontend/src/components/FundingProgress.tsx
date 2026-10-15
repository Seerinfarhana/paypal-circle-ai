import { useRef } from 'react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { CountUp } from './ui/CountUp'
import { usd } from '@/lib/utils'

export function FundingProgress({ funded, required, large }: { funded: number; required: number; large?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const pct = Math.min((funded / required) * 100, 100)
  const complete = funded >= required
  useGsap((reduced) => {
    gsap.to(bar.current, { width: `${pct}%`, duration: reduced ? 0 : 1.1, ease: 'power3.out' })
  }, root, [pct])
  return (
    <div ref={root}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className={large ? 'text-3xl font-semibold' : 'text-xl font-semibold'}>
          <CountUp to={funded} prefix="$" /> <span className="text-muted">/ {usd(required)}</span>
        </p>
        <p className={`text-sm font-medium ${complete ? 'text-ok' : 'text-muted'}`}>{complete ? '✓ Fully funded' : `${usd(required - funded)} to go`}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={required} aria-valuenow={funded} aria-label="Funding progress">
        <div ref={bar} className={`h-full w-0 rounded-full ${complete ? 'bg-ok' : 'bg-gradient-to-r from-navy to-brand'}`} />
      </div>
    </div>
  )
}
