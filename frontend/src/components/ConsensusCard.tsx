import { useRef } from 'react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { productById, totals } from '@/data/mock'
import { useCircleStore, selectRequired } from '@/store/circleStore'
import { usd } from '@/lib/utils'

export function ConsensusCard() {
  const selectedId = useCircleStore((s) => s.selectedId)
  const required = useCircleStore(selectRequired)
  const root = useRef<HTMLDivElement>(null)
  useGsap((reduced) => {
    if (reduced) return
    gsap.fromTo('[data-glow]', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' })
    gsap.fromTo('[data-row]', { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, delay: 0.25, duration: 0.5 })
    gsap.fromTo('[data-mote]', { y: 14, opacity: 0 }, { y: -26, opacity: 0.9, duration: 2.2, stagger: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 1 })
  }, root, [])
  if (!selectedId) return null
  const p = productById(selectedId)
  const t = totals(p)
  return (
    <div ref={root} className="relative overflow-hidden rounded-card border border-brand/20 bg-white p-6 shadow-card">
      <div data-glow className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-sky/30 to-transparent blur-2xl" aria-hidden="true" />
      {[10, 34, 62, 86].map((l, i) => <span key={l} data-mote className="pointer-events-none absolute top-6 h-1.5 w-1.5 rounded-full bg-sky/70" style={{ left: `${l}%`, marginTop: i * 6 }} aria-hidden="true" />)}
      <h3 className="relative text-xl font-semibold">Everyone's on board <span aria-hidden="true">🎉</span></h3>
      <p className="relative mt-1 text-sm text-muted">Product finalized</p>
      <p className="relative mt-4 text-2xl font-semibold text-navy">{p.name}</p>
      <dl className="relative mt-4 divide-y divide-slate-100 text-sm">
        {[['Product price', usd(t.price)], ['Shipping', usd(t.shipping)], ['Estimated tax', usd(t.tax)]].map(([k, v]) => (
          <div data-row key={k} className="flex justify-between py-2"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>
        ))}
        <div data-row className="flex justify-between pt-3 text-base"><dt className="font-semibold">Required funding</dt><dd className="font-semibold text-brand-dark">{usd(required)}</dd></div>
      </dl>
    </div>
  )
}
