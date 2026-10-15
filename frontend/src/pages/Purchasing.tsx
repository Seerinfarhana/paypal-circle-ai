import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { gsap, useGsap } from '@/hooks/useGsap'
import { PurchaseAgentStepper, AGENT_STEPS } from '@/components/PurchaseAgentStepper'
import { Button } from '@/components/ui/Button'
import { useCircleStore } from '@/store/circleStore'
import { usd } from '@/lib/utils'

const PRICE_STEP = 1 // "Checking current price"

export default function Purchasing() {
  const nav = useNavigate()
  const s = useCircleStore()
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const changed = s.purchase === 'price-changed'

  // Guard: opening this route directly without starting a purchase sends you back.
  useEffect(() => { if (s.purchase === 'idle') nav('/app/circles/sarah', { replace: true }) }, [])

  useEffect(() => {
    if (s.purchase !== 'running') return
    if (active >= AGENT_STEPS.length) { s.finishPurchase(); setTimeout(() => nav('/app/circles/sarah/complete'), 900); return }
    if (s.priceChangeDemo && active === PRICE_STEP) { const t = setTimeout(() => s.flagPriceChange(), 1100); return () => clearTimeout(t) }
    const t = setTimeout(() => setActive((a) => a + 1), 1150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, s.purchase])

  useGsap((reduced) => {
    if (changed && !reduced) gsap.fromTo('[data-alert]', { y: 18, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' })
  }, root, [changed])

  return (
    <div ref={root} className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-6 p-4 sm:p-6 lg:min-h-dvh">
      <div className="text-center">
        <p className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white"><ShieldCheck aria-hidden="true" /></p>
        <h1 className="text-2xl font-semibold sm:text-3xl">{changed ? 'Purchase paused' : 'Circle AI is completing your purchase'}</h1>
        <p className="mt-2 text-muted">{changed ? 'The agent stopped before charging anyone.' : 'Checks run in order. Nobody is charged until every check passes.'}</p>
      </div>
      <div className="rounded-xl2 border border-slate-200 bg-white p-3 shadow-card sm:p-4" aria-live="polite">
        <PurchaseAgentStepper active={active} failed={changed ? PRICE_STEP : undefined} />
      </div>
      {changed && (
        <div data-alert role="alert" className="rounded-card border border-warn/30 bg-warn-soft p-5">
          <p className="flex items-center gap-2 text-lg font-semibold text-warn"><AlertTriangle size={20} aria-hidden="true" />Price changed</p>
          <p className="mt-1 text-ink">The purchase exceeds the group's approved amount by $8.</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-white p-3"><dt className="text-muted">Approved Maximum</dt><dd className="text-xl font-semibold">{usd(150)}</dd></div><div className="rounded-xl bg-white p-3"><dt className="text-muted">Current Total</dt><dd className="text-xl font-semibold text-warn">{usd(158)}</dd></div></dl>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => { s.requestExtraFunding(); nav('/app/circles/sarah') }}>Request Additional Funding</Button>
            <Button variant="secondary" onClick={() => { s.setPriceChangeDemo(false); useCircleStore.setState({ purchase: 'idle', selectedId: null, phase: 'products', contributions: { seerin: 50, alex: 40, john: 0, emma: 0 } }); nav('/app/circles/sarah') }}>Find Alternative</Button>
          </div>
          <p className="mt-3 text-xs text-muted">Circle AI never spends beyond the amount the group approved.</p>
        </div>
      )}
    </div>
  )
}
