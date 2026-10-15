import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Truck } from 'lucide-react'
import { SpotlightCard } from './ui/Card'
import { buttonVariants } from './ui/Button'
import { AvatarStack } from './ui/Avatar'
import { StatusPill } from './ui/AIThinking'
import { CircleProgress } from './CircleProgress'
import { stepLabels, productById, type CircleMeta, type StepState } from '@/data/mock'
import { useCircleStore, timelineStates } from '@/store/circleStore'
import { cn, usd } from '@/lib/utils'

function useSarahLive(c: CircleMeta) {
  const phase = useCircleStore((s) => s.phase)
  const selectedId = useCircleStore((s) => s.selectedId)
  if (c.id !== 'sarah') return { ...c, purchased: false }
  const t = timelineStates(phase) // budget, prefs, products, voting, funding, purchase
  const steps: StepState[] = [t[0], t[1], t[3] === 'todo' && t[2] === 'current' ? 'todo' : t[3], t[4], t[5]]
  const status = phase === 'done' ? 'Purchased' : phase === 'purchase' ? 'Ready to Purchase' : phase === 'funding' ? 'Funding' : phase === 'voting' ? 'Voting' : phase === 'products' ? 'Choosing Gift' : 'Setting Budget'
  return { ...c, steps, status, product: selectedId ? productById(selectedId).name : 'Not decided', purchased: phase === 'done' }
}

const deliverySteps = ['Ordered', 'Packed', 'Shipped', 'Delivered']
export function DeliveryTimeline() {
  return (
    <ol className="flex items-center gap-1 text-[11px] text-muted" aria-label="Delivery progress">
      {deliverySteps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-1">
          <span className={i === 0 ? 'font-medium text-ok' : ''}>{i === 0 ? '✓ ' : ''}{s}</span>
          {i < deliverySteps.length - 1 && <span className={`h-0.5 flex-1 rounded ${i === 0 ? 'bg-ok/60' : 'bg-slate-200'}`} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

export function CircleCard({ circle }: { circle: CircleMeta }) {
  const c = useSarahLive(circle)
  return (
    <SpotlightCard className="flex flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{c.name} <span aria-hidden="true">{c.emoji}</span></h3>
          <div className="mt-1.5">
            {c.purchased
              ? <StatusPill tone="ok" icon={<CheckCircle2 size={13} aria-hidden="true" />}>Purchased</StatusPill>
              : <StatusPill>{c.status}</StatusPill>}
          </div>
        </div>
        <AvatarStack ids={c.members} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div><dt className="text-muted">Budget</dt><dd className="font-semibold">{usd(c.budget)}</dd></div>
        <div><dt className="text-muted">{c.purchased ? 'Delivery' : 'Selected product'}</dt><dd className="truncate font-semibold">{c.purchased ? 'Oct 22' : c.product}</dd></div>
      </dl>
      {c.purchased ? (
        <div className="space-y-2"><div className="flex items-center gap-2 text-sm font-medium text-ok"><Truck size={15} aria-hidden="true" />Portable Photo Printer is on its way</div><DeliveryTimeline /></div>
      ) : (
        <CircleProgress labels={stepLabels} states={c.steps} />
      )}
      <Link to={`/app/circles/${c.id}`} className={cn(buttonVariants({ variant: 'secondary' }), 'mt-auto')}>
        Open Circle <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </SpotlightCard>
  )
}
