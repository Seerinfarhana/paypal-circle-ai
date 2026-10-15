import { useEffect, useRef, useState } from 'react'
import { Check, Lock, ShieldCheck } from 'lucide-react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { Overlay } from './ui/Overlay'
import { AIThinking } from './ui/AIThinking'
import { useCircleStore, selectFunded, selectRequired } from '@/store/circleStore'
import { members, ME } from '@/data/mock'
import { cn, usd } from '@/lib/utils'

const DEMO_AMOUNT: Record<string, number> = { alex: 20, john: 30, emma: 30 }

/** Stand-in for the official PayPal Checkout component. Replace the body with the PayPal Buttons SDK. */
export function PayPalSheet({ amount, open, onClose, onApproved }: { amount: number; open: boolean; onClose: () => void; onApproved: () => void }) {
  const [state, setState] = useState<'connecting' | 'approved'>('connecting')
  useEffect(() => {
    if (!open) return
    setState('connecting')
    const a = setTimeout(() => setState('approved'), 1300)
    const b = setTimeout(() => { onApproved(); onClose() }, 2300)
    return () => { clearTimeout(a); clearTimeout(b) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  return (
    <Overlay open={open} onClose={onClose} title="Pay with PayPal" className="max-w-sm">
      <div className="px-5 pb-6 text-center">
        <p className="text-3xl font-semibold">{usd(amount)}</p>
        <p className="mt-1 text-sm text-muted">Contribution to Sarah's Birthday</p>
        <div className="mt-6 flex justify-center">
          {state === 'connecting'
            ? <AIThinking label="Connecting to PayPal" />
            : <span className="flex items-center gap-2 rounded-2xl bg-ok-soft px-4 py-3 text-sm font-medium text-ok"><Check size={16} aria-hidden="true" />Authorized</span>}
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock size={12} aria-hidden="true" />Demo checkout. The PayPal Checkout component replaces this sheet.</p>
      </div>
    </Overlay>
  )
}

export function ContributionCard() {
  const s = useCircleStore()
  const funded = useCircleStore(selectFunded)
  const required = useCircleStore(selectRequired)
  const remaining = Math.max(required - funded, 0)
  const [amount, setAmount] = useState('')
  const [sheet, setSheet] = useState<number | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const split = Math.min(Math.round((required / members.length) * 100) / 100, remaining)
  const value = Number(amount)

  // Glow + "+$" float on the contributing member
  useGsap((reduced) => {
    const c = s.lastContribution
    if (!c || reduced) return
    gsap.fromTo(`[data-row="${c.memberId}"] [data-avatar]`, { boxShadow: '0 0 0 0 rgba(0,112,224,.6)' }, { boxShadow: '0 0 0 10px rgba(0,112,224,0)', duration: 1.2, ease: 'power2.out' })
    gsap.fromTo(`[data-plus="${c.memberId}"]`, { y: 6, opacity: 0 }, { y: -4, opacity: 1, duration: 0.4, yoyo: true, repeat: 1, repeatDelay: 1 })
  }, root, [s.lastContribution?.nonce])

  return (
    <div ref={root} className="space-y-5">
      <ul className="space-y-2" aria-label="Member contributions">
        {members.map((m) => {
          const paid = s.contributions[m.id] ?? 0
          const demo = m.id !== ME && paid === 0 && remaining > 0
          return (
            <li key={m.id} data-row={m.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <span className="flex items-center gap-3 font-medium"><Avatar id={m.id} size={32} />{m.name}</span>
              <span className="flex items-center gap-3">
                <span data-plus={m.id} className="text-sm font-semibold text-brand opacity-0">+{usd(s.lastContribution?.memberId === m.id ? s.lastContribution.amount : 0)}</span>
                {demo && <button onClick={() => s.contribute(m.id, Math.min(DEMO_AMOUNT[m.id], remaining))} className="rounded-md border border-dashed border-muted/40 px-2 py-1 text-xs text-muted hover:bg-mist" title="Demo: simulate this member contributing">Demo: contribute {usd(Math.min(DEMO_AMOUNT[m.id], remaining))}</button>}
                <span className="text-right">
                  <span className="block font-semibold tabular-nums">{usd(paid)}</span>
                  <span className={cn('flex items-center justify-end gap-1 text-xs', paid ? 'text-ok' : 'text-muted')}>{paid ? <><Check size={12} aria-hidden="true" />Authorized</> : 'Not contributed'}</span>
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      {remaining > 0 ? (
        <div className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="font-semibold">Your contribution</h3>
          <p className="mt-0.5 text-sm text-muted">Contribute any amount. Members don't need to pay equally.</p>
          <label htmlFor="amt" className="sr-only">Contribution amount in dollars</label>
          <div className="relative mt-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted">$</span>
            <input id="amt" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="0.00" className="h-14 w-full rounded-2xl border border-slate-200 pl-9 pr-4 text-xl font-semibold outline-none focus:border-brand" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="soft" onClick={() => setAmount(String(split))}>Suggested split {usd(split)}</Button>
            <Button size="sm" variant="soft" onClick={() => setAmount(String(remaining))}>Pay full amount {usd(remaining)}</Button>
          </div>
          <Button size="lg" className="mt-4 w-full" disabled={!(value > 0)} onClick={() => setSheet(Math.min(value, remaining))}>
            Contribute with PayPal
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck size={13} aria-hidden="true" />Funds are only used when the group's purchase conditions are met.</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-ok/25 bg-ok-soft p-4 text-ok"><Check aria-hidden="true" /><p className="font-semibold">Funding complete</p></div>
      )}
      <PayPalSheet open={sheet !== null} amount={sheet ?? 0} onClose={() => setSheet(null)} onApproved={() => { s.contribute(ME, sheet ?? 0); setAmount('') }} />
    </div>
  )
}
