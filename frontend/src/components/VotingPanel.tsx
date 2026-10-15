import { useRef } from 'react'
import { Check, ThumbsDown, Clock, ArrowRight } from 'lucide-react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { AIBadge, AIThinking } from './ui/AIThinking'
import { ConsensusCard } from './ConsensusCard'
import { useCircleStore, DECLINE_REASONS, type Vote } from '@/store/circleStore'
import { members, ME, memberById, productById } from '@/data/mock'
import { cn, usd } from '@/lib/utils'

export function MemberVote({ id, vote, onSimulate }: { id: string; vote: Vote; onSimulate?: () => void }) {
  const m = memberById(id)
  const look = vote === 'approve' ? { t: 'Approve', c: 'text-ok bg-ok-soft', i: <Check size={14} aria-hidden="true" /> }
    : vote === 'decline' ? { t: 'Decline', c: 'text-bad bg-bad-soft', i: <ThumbsDown size={13} aria-hidden="true" /> }
    : { t: 'Pending', c: 'text-warn bg-warn-soft', i: <Clock size={13} aria-hidden="true" /> }
  return (
    <li data-vote={vote} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
      <span className="flex items-center gap-3 font-medium"><Avatar id={id} size={30} />{m.name}{id === ME && <span className="text-xs font-normal text-muted">(you)</span>}</span>
      <span className="flex items-center gap-2">
        {vote === 'pending' && onSimulate && <button onClick={onSimulate} className="rounded-md border border-dashed border-muted/40 px-2 py-1 text-xs text-muted hover:bg-mist" title="Demo: simulate this member voting">Demo: simulate vote</button>}
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', look.c)}>{look.i}{look.t}</span>
      </span>
    </li>
  )
}

export function VotingPanel({ onGoProducts }: { onGoProducts: () => void }) {
  const { votes, activeVoteId, selectedId, declineStage, declineMember, castVote, simulateJohn, answerDecline } = useCircleStore()
  const root = useRef<HTMLDivElement>(null)
  const round = activeVoteId ? votes[activeVoteId] : null
  const approved = round ? Object.values(round).filter((v) => v === 'approve').length : 0
  const pct = Math.round((approved / members.length) * 100)

  useGsap((reduced) => {
    gsap.to('[data-vote-bar]', { width: `${pct}%`, duration: reduced ? 0 : 0.9, ease: 'power3.out' })
  }, root, [pct, activeVoteId])
  useGsap((reduced) => {
    if (!reduced && declineStage !== 'none') gsap.fromTo('[data-decline]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' })
  }, root, [declineStage])

  if (selectedId) return <div ref={root} className="space-y-4 p-4 sm:p-6"><ConsensusCard /></div>
  if (!round || !activeVoteId)
    return (
      <div ref={root} className="m-4 rounded-card border border-dashed border-slate-300 p-10 text-center sm:m-6">
        <p className="font-semibold">No vote in progress</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">Pick a product from the shortlist and choose Vote to start collecting approvals.</p>
        <Button className="mt-4" onClick={onGoProducts}>See recommendations</Button>
      </div>
    )

  const p = productById(activeVoteId)
  const Icon = p.icon
  const decliner = declineMember ? memberById(declineMember) : null
  return (
    <div ref={root} className="space-y-5 p-4 sm:p-6">
      <div className="flex items-center gap-4 rounded-card border border-slate-200 bg-white p-4 shadow-card">
        <span className={cn('flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br', p.tone)}><Icon size={30} strokeWidth={1.4} className="text-navy/70" aria-hidden="true" /></span>
        <div className="flex-1"><p className="text-lg font-semibold">{p.name}</p><p className="text-muted">{usd(p.price)}</p></div>
        <div className="text-right"><p className="text-2xl font-semibold">{pct}%</p><p className="text-xs text-muted">Approved</p></div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div data-vote-bar className="h-full w-0 rounded-full bg-brand" /></div>

      <ul className="space-y-2" aria-label="Member votes">
        {members.map((m) => (
          <MemberVote key={m.id} id={m.id} vote={round[m.id] ?? 'pending'}
            onSimulate={m.id === 'john' && declineStage === 'none' ? () => simulateJohn(activeVoteId) : undefined} />
        ))}
      </ul>

      {round[ME] === 'pending' && declineStage === 'none' && (
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" onClick={() => castVote(activeVoteId, ME, 'approve')}><Check size={18} aria-hidden="true" />Approve</Button>
          <Button size="lg" variant="danger" onClick={() => castVote(activeVoteId, ME, 'decline')}><ThumbsDown size={17} aria-hidden="true" />Decline</Button>
        </div>
      )}

      {declineStage === 'asking' && decliner && (
        <div data-decline className="ai-surface rounded-card p-5">
          <AIBadge />
          <p className="mt-3 font-medium text-navy">{decliner.name}, what concerns you about this option?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DECLINE_REASONS.map((r) => <button key={r} onClick={() => answerDecline(r)} className="rounded-full border border-brand/25 bg-white px-3.5 py-2 text-sm font-medium text-navy transition hover:-translate-y-0.5 hover:border-brand hover:bg-mist active:scale-95">{r}</button>)}
          </div>
          <p className="mt-3 text-xs text-muted">Demo: you're answering on behalf of {decliner.name}.</p>
        </div>
      )}
      {declineStage === 'thinking' && <div data-decline><AIThinking label="Updating the group's constraints and re-ranking recommendations" /></div>}
      {declineStage === 'done' && (
        <div data-decline className="ai-surface rounded-card p-5">
          <AIBadge />
          <p className="mt-3 font-medium text-navy">Thanks. I've updated the group's constraints and will adjust the recommendations.</p>
          <Button className="mt-4" onClick={onGoProducts}>See updated recommendations <ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
      )}
    </div>
  )
}
