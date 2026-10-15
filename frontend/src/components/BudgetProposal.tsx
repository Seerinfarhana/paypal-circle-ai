import { useRef, useState } from 'react'
import { Check, Clock, PartyPopper } from 'lucide-react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { useCircleStore } from '@/store/circleStore'
import { members, ME } from '@/data/mock'
import { usd } from '@/lib/utils'

export function BudgetProposal() {
  const { proposedBudget, budgetApprovals, budgetAgreed, approveBudget, proposeBudget } = useCircleStore()
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const approved = Object.values(budgetApprovals).filter(Boolean).length

  useGsap((reduced) => {
    if (reduced) return
    gsap.fromTo('[data-approved="true"] [data-check]', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.08 })
  }, root, [approved])
  useGsap((reduced) => {
    if (budgetAgreed && !reduced) gsap.fromTo('[data-agreed]', { y: 12, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' })
  }, root, [budgetAgreed])

  if (budgetAgreed)
    return (
      <div ref={root}>
        <div data-agreed className="flex items-center gap-3 rounded-2xl border border-ok/25 bg-ok-soft p-4 text-ok">
          <PartyPopper size={22} aria-hidden="true" />
          <div><p className="font-semibold">Budget agreed — {usd(proposedBudget)}</p><p className="text-sm opacity-80">All {members.length} members approved.</p></div>
        </div>
      </div>
    )

  return (
    <div ref={root} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-end justify-between">
        <div><p className="text-sm text-muted">Proposed Budget</p><p className="text-3xl font-semibold">{usd(proposedBudget)}</p></div>
        <p className="text-sm font-medium text-muted">{approved} of {members.length} approved</p>
      </div>
      <ul className="my-4 grid grid-cols-2 gap-2">
        {members.map((m) => {
          const ok = budgetApprovals[m.id]
          return (
            <li key={m.id} data-approved={ok} className="flex items-center justify-between rounded-xl bg-mist px-3 py-2 text-sm">
              <span className="flex items-center gap-2"><Avatar id={m.id} size={22} />{m.name}</span>
              {ok
                ? <span data-check className="flex items-center gap-1 font-medium text-ok"><Check size={14} aria-hidden="true" />Approved</span>
                : (
                  <span className="flex items-center gap-1 text-warn"><Clock size={13} aria-hidden="true" />Pending
                    {m.id !== ME && <button onClick={() => approveBudget(m.id)} className="ml-1 rounded-md border border-dashed border-muted/40 px-1.5 py-0.5 text-[11px] text-muted hover:bg-white" title="Demo: simulate this member approving">Demo: approve</button>}
                  </span>
                )}
            </li>
          )
        })}
      </ul>
      {editing ? (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = Number(amount); if (v > 0) { proposeBudget(v); setEditing(false); setAmount('') } }}>
          <label className="sr-only" htmlFor="alt-budget">Suggested budget in dollars</label>
          <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
            <input id="alt-budget" inputMode="numeric" autoFocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="275" className="h-11 w-full rounded-2xl border border-slate-200 pl-7 pr-3 outline-none focus:border-brand" /></div>
          <Button type="submit" size="md">Suggest</Button>
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button disabled={budgetApprovals[ME]} onClick={() => approveBudget(ME)}>{budgetApprovals[ME] ? <><Check size={16} aria-hidden="true" />You approved</> : 'Approve'}</Button>
          <Button variant="secondary" onClick={() => setEditing(true)}>Suggest another amount</Button>
        </div>
      )}
    </div>
  )
}
