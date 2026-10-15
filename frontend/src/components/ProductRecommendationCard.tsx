import { Check, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'
import { StatusPill } from './ui/AIThinking'
import { SpotlightCard } from './ui/Card'
import { cn, usd } from '@/lib/utils'
import type { Product } from '@/data/mock'

interface Props {
  product: Product; featured?: boolean; badge?: string; voted?: boolean
  onView: () => void; onVote: () => void
}

/** AI-curated pick: a match score and reasons lead; price is secondary. Featured picks get glare. */
export function ProductRecommendationCard({ product: p, featured, badge, voted, onView, onVote }: Props) {
  const Icon = p.icon
  return (
    <SpotlightCard data-product={p.id} className={cn('flex h-full flex-col', featured && 'glare border-brand/30')}>
      <div className={cn('relative flex h-36 items-center justify-center bg-gradient-to-br', p.tone)}>
        <Icon size={54} strokeWidth={1.3} className="text-navy/70" aria-hidden="true" />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-navy shadow-sm">
          <Sparkles size={12} className="text-brand" aria-hidden="true" />{p.match}% match
        </span>
        {badge && <span className="absolute right-4 top-4"><StatusPill tone="ok">{badge}</StatusPill></span>}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug">{p.name}</h3>
          <p className="text-lg font-semibold">{usd(p.price)}</p>
        </div>
        <ul className="space-y-1.5 text-sm text-muted">
          {p.reasons.slice(0, 4).map((r) => <li key={r} className="flex items-center gap-2"><Check size={14} className="shrink-0 text-ok" aria-hidden="true" />{r}</li>)}
        </ul>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Button variant="secondary" onClick={onView} aria-label={`View details for ${p.name}`}>View Details</Button>
          <Button onClick={onVote} aria-label={`Vote on ${p.name}`}>{voted ? 'Open Vote' : 'Vote'}</Button>
        </div>
      </div>
    </SpotlightCard>
  )
}
