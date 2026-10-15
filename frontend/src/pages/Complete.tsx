import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Package, Truck } from 'lucide-react'
import { gsap, useGsap } from '@/hooks/useGsap'
import { OrderSummary } from '@/components/OrderSummary'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Overlay } from '@/components/ui/Overlay'
import { useCircleStore, useFinalSplit } from '@/store/circleStore'
import { cn, usd } from '@/lib/utils'

const track = [['Ordered', 'Today', true], ['Packed', 'Oct 14', false], ['Shipped', 'Oct 16', false], ['Delivered', 'Oct 22', false]] as const

export default function Complete() {
  const [tracking, setTracking] = useState(false)
  const [receipt, setReceipt] = useState(false)
  const { finalTotal } = useFinalSplit()
  const phase = useCircleStore((s) => s.phase)
  const root = useRef<HTMLDivElement>(null)
  useGsap((reduced) => {
    const circle = root.current?.querySelector<SVGCircleElement>('[data-ring]')
    const check = root.current?.querySelector<SVGPathElement>('[data-check]')
    if (reduced || !circle || !check) return
    const tl = gsap.timeline()
    tl.fromTo('[data-halo]', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' })
      .fromTo(circle, { strokeDashoffset: 176 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0)
      .fromTo(check, { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
      .fromTo('[data-rise]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 }, 0.6)
  }, root, [])
  return (
    <div ref={root} className="mx-auto max-w-xl space-y-6 p-4 sm:p-6 lg:py-12">
      <div className="text-center">
        <div className="relative mx-auto mb-5 h-24 w-24">
          <span data-halo className="absolute inset-[-18px] rounded-full bg-gradient-to-br from-sky/25 to-transparent blur-xl" aria-hidden="true" />
          <svg viewBox="0 0 64 64" className="relative h-24 w-24" aria-hidden="true">
            <circle data-ring cx="32" cy="32" r="28" fill="#E6F6EF" stroke="#047857" strokeWidth="3" strokeDasharray="176" />
            <path data-check d="M20 33l8 8 16-17" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" />
          </svg>
        </div>
        <h1 data-rise className="text-3xl font-semibold">Purchase complete</h1>
        <p data-rise className="mt-1 text-muted">{usd(finalTotal, 2)} paid with PayPal. Posted to the Circle chat.</p>
      </div>
      <div data-rise className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card"><OrderSummary /></div>
      {tracking && (
        <ol className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card" aria-label="Order tracking">
          {track.map(([l, d, done], i) => (
            <li key={l} className="flex items-center gap-3 py-2"><span className={cn('flex h-6 w-6 items-center justify-center rounded-full', done ? 'bg-ok text-white' : 'border-2 border-slate-300')}>{done && <Check size={13} strokeWidth={3} aria-hidden="true" />}</span><span className="font-medium">{l}</span><span className="ml-auto text-sm text-muted">{d}{i === 0 ? ' · Complete' : ' · Expected'}</span></li>
          ))}
        </ol>
      )}
      <div data-rise className="grid gap-2 sm:grid-cols-3">
        <Button onClick={() => setTracking((t) => !t)}><Truck size={16} aria-hidden="true" />Track Order</Button>
        <Button variant="secondary" onClick={() => setReceipt(true)}><Package size={16} aria-hidden="true" />View Receipt</Button>
        <Link to="/app/circles/sarah" className={cn(buttonVariants({ variant: 'secondary' }))}>Back to Circle</Link>
      </div>
      {phase !== 'done' && <p className="text-center text-xs text-muted">Demo: run the full flow from the Circle to see live totals.</p>}
      <Overlay open={receipt} onClose={() => setReceipt(false)} title="Receipt #PC-A84D92" className="max-w-md"><div className="px-5 pb-6"><OrderSummary /></div></Overlay>
    </div>
  )
}
