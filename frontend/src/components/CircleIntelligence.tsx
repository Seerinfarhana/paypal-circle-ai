import { Check } from 'lucide-react'
import { CountUp } from './ui/CountUp'
import { PreferenceTags, defaultLikes } from './PreferenceTags'
import { FundingProgress } from './FundingProgress'
import { useCircleStore, PHASES, timelineStates, selectFunded, selectRequired } from '@/store/circleStore'
import { members } from '@/data/mock'
import { cn, usd } from '@/lib/utils'

/** Live summary of the Circle. Reads from the store, so it reacts as the demo progresses. */
export function CircleIntelligence() {
  const s = useCircleStore()
  const funded = useCircleStore(selectFunded)
  const required = useCircleStore(selectRequired)
  const states = timelineStates(s.phase)
  const round = s.activeVoteId ? s.votes[s.activeVoteId] : null
  const consensus = s.selectedId || s.phase === 'purchase' || s.phase === 'done' ? 100
    : round ? Math.round((Object.values(round).filter((v) => v === 'approve').length / members.length) * 100)
    : s.budgetAgreed ? 100 : Math.round((Object.values(s.budgetApprovals).filter(Boolean).length / members.length) * 100)
  const section = 'rounded-2xl border border-slate-100 bg-white p-4'
  const h = 'mb-2 text-sm font-semibold text-muted'
  return (
    <div className="space-y-3 p-4">
      <section className={section}>
        <h3 className={h}>Circle goal</h3>
        <p className="font-semibold">Birthday gift for Sarah</p>
      </section>
      <section className={cn(section, 'grid grid-cols-2 gap-4')}>
        <div><h3 className={h}>Budget</h3><p className="text-2xl font-semibold"><CountUp to={s.budgetAgreed ? s.budget : s.proposedBudget} prefix="$" /></p><p className="text-xs text-muted">{s.budgetAgreed ? 'Agreed' : 'Proposed'}</p></div>
        <div><h3 className={h}>Consensus</h3><p className="text-2xl font-semibold"><CountUp to={consensus} suffix="%" /></p><p className="text-xs text-muted">{s.phase === 'budget' ? 'On budget' : round && !s.selectedId ? 'On product' : 'Agreed'}</p></div>
      </section>
      <section className={section}><h3 className={h}>Group preferences</h3><PreferenceTags likes={defaultLikes} avoid={['Perfume', ...s.constraints.filter((c) => !c.startsWith('Avoid')).map((c) => c.replace(/^.*?: /, ''))]} compact /></section>
      <section className={section}>
        <h3 className={h}>Current stage</h3>
        <ol className="space-y-2.5">
          {PHASES.map((p, i) => (
            <li key={p.key} className="flex items-center gap-3 text-sm">
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-500', states[i] === 'done' && 'border-brand bg-brand text-white', states[i] === 'current' && 'border-brand animate-ring', states[i] === 'todo' && 'border-slate-300')}>
                {states[i] === 'done' ? <Check size={11} strokeWidth={3} aria-hidden="true" /> : states[i] === 'current' ? <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" /> : null}
              </span>
              <span className={states[i] === 'todo' ? 'text-muted' : 'font-medium'}>{p.label}</span>
              <span className="sr-only">{states[i]}</span>
            </li>
          ))}
        </ol>
      </section>
      {(s.selectedId || s.phase === 'funding') && <section className={section}><h3 className={h}>Funding</h3><FundingProgress funded={funded} required={required} /><p className="mt-2 text-xs text-muted">Required: {usd(required)}</p></section>}
    </div>
  )
}
