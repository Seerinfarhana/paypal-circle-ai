import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, Gauge, MessageSquare, Package, Settings, Sparkles, UserPlus, Vote, Wallet, ShoppingCart, Heart } from 'lucide-react'
import { gsap, useGsap } from '@/hooks/useGsap'
import { AvatarStack } from '@/components/ui/Avatar'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Overlay } from '@/components/ui/Overlay'
import { AIBadge, StatusPill } from '@/components/ui/AIThinking'
import { CountUp } from '@/components/ui/CountUp'
import { CircleChat } from '@/components/CircleChat'
import { CircleIntelligence } from '@/components/CircleIntelligence'
import { BudgetProposal } from '@/components/BudgetProposal'
import { PreferenceTags } from '@/components/PreferenceTags'
import { ProductRecommendationCard } from '@/components/ProductRecommendationCard'
import { AIMatchScore } from '@/components/AIMatchScore'
import { VotingPanel } from '@/components/VotingPanel'
import { ConsensusCard } from '@/components/ConsensusCard'
import { FundingProgress } from '@/components/FundingProgress'
import { ContributionCard } from '@/components/ContributionCard'
import { PurchaseChecklist } from '@/components/PurchaseChecklist'
import { useCircleStore, phaseLabel, selectFunded, selectRequired, timelineStates } from '@/store/circleStore'
import { circles, members, ME, productById, products, type Product } from '@/data/mock'
import { cn, usd } from '@/lib/utils'

type Tab = 'overview' | 'chat' | 'preferences' | 'products' | 'votes' | 'funding' | 'purchase'
const TABS: { id: Tab; label: string; icon: typeof Gauge }[] = [
  { id: 'overview', label: 'Overview', icon: Gauge }, { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'preferences', label: 'Preferences', icon: Heart }, { id: 'products', label: 'Products', icon: Package },
  { id: 'votes', label: 'Votes', icon: Vote }, { id: 'funding', label: 'Funding', icon: Wallet }, { id: 'purchase', label: 'Purchase', icon: ShoppingCart },
]

const SORTS = ['Recommended', 'Price', 'Match', 'Popular'] as const

function ProductsView({ go }: { go: (t: Tab) => void }) {
  const s = useCircleStore()
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Recommended')
  const [open, setOpen] = useState<Product | null>(null)
  const [outgoing, setOutgoing] = useState<string | null>(s.pendingRejectTransition ? s.rejected[s.rejected.length - 1] : null)
  const root = useRef<HTMLDivElement>(null)

  // After a decline: the rejected pick slides away, improved picks fade in.
  useEffect(() => {
    if (!s.pendingRejectTransition) return
    const id = s.rejected[s.rejected.length - 1]
    const done = () => { setOutgoing(null); s.clearRejectTransition() }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return }
    const card = root.current?.querySelector(`[data-product="${id}"]`)
    const tl = gsap.timeline({ delay: 0.5, onComplete: done })
    if (card) tl.to(card, { x: -80, opacity: 0, scale: 0.94, duration: 0.7, ease: 'power3.in' })
    tl.fromTo('[data-new]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)' }, '-=0.1')
    return () => { tl.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visible = products.filter((p) => (!p.late || s.rejected.length > 0) && (!s.rejected.includes(p.id) || p.id === outgoing))
  const rank = (p: Product) => (s.rejected.length && p.id === 'printer' ? 100 : p.match)
  const sorted = [...visible].sort((a, b) => sort === 'Price' ? a.price - b.price : sort === 'Match' ? b.match - a.match : sort === 'Popular' ? b.popular - a.popular : rank(b) - rank(a))
  const setAside = products.filter((p) => s.rejected.includes(p.id) && p.id !== outgoing)

  return (
    <div ref={root} className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-semibold"><Sparkles size={20} className="text-brand" aria-hidden="true" />Recommended by Circle AI</h2>
        <p className="mt-1 text-muted">Based on everyone's preferences, budget and discussion.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sort products">
        {SORTS.map((f) => <button key={f} aria-pressed={sort === f} onClick={() => setSort(f)} className={cn('rounded-full border px-4 py-1.5 text-sm font-medium transition active:scale-95', sort === f ? 'border-navy bg-navy text-white' : 'border-slate-200 bg-white hover:border-brand/50')}>{f}</button>)}
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 2xl:grid-cols-3">
        {sorted.map((p, i) => (
          <div key={p.id} data-new={p.late ? '' : undefined} className="w-[82%] shrink-0 snap-center md:w-auto">
            <ProductRecommendationCard product={p} featured={i === 0} voted={!!s.votes[p.id]}
              badge={p.late ? 'Improved pick' : s.rejected.length && p.id === 'printer' ? 'Top pick' : undefined}
              onView={() => setOpen(p)} onVote={() => { s.startVote(p.id); go('votes') }} />
          </div>
        ))}
      </div>
      {setAside.length > 0 && (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="mb-1 font-semibold">Set aside by the group</p>
          {setAside.map((p) => <p key={p.id} className="text-muted">{p.name} · {s.constraints[s.constraints.length - 1].replace(/^.*?: /, '')}</p>)}</div>
      )}
      <Overlay open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} className="max-w-2xl">
        {open && (
          <div className="space-y-6 px-5 pb-6">
            <div className="flex items-baseline justify-between"><p className="text-2xl font-semibold">{usd(open.price)}</p><StatusPill tone="ok" icon={<Check size={12} aria-hidden="true" />}>Within {usd(s.budget)} budget</StatusPill></div>
            <AIMatchScore product={open} />
            <div className="ai-surface rounded-2xl p-4"><AIBadge /><p className="mt-2 text-navy">{open.explanation}</p></div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { const id = open.id; setOpen(null); s.startVote(id); go('votes') }}>Vote on this</Button>
              <Button variant="secondary" onClick={() => { setOpen(null); s.setAi(true, 'Why was this product recommended?') }}><Sparkles size={16} aria-hidden="true" />Ask Circle AI</Button>
            </div>
          </div>
        )}
      </Overlay>
    </div>
  )
}

function OverviewView({ go }: { go: (t: Tab) => void }) {
  const s = useCircleStore()
  const next = s.phase === 'budget' ? { t: 'Approve the budget', to: 'chat' as Tab } : s.phase === 'products' ? { t: 'Review recommendations', to: 'products' as Tab } : s.phase === 'voting' ? { t: 'Cast your vote', to: 'votes' as Tab } : s.phase === 'funding' ? { t: 'Contribute', to: 'funding' as Tab } : s.phase === 'purchase' ? { t: 'Start the purchase', to: 'purchase' as Tab } : null
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div><p className="text-sm text-muted">What the group is trying to accomplish</p><h2 className="text-2xl font-semibold">Find a birthday gift for Sarah under {usd(s.budget)}</h2></div>
      {next && <button onClick={() => go(next.to)} className="flex w-full items-center justify-between rounded-card bg-brand/10 p-4 text-left font-semibold text-brand-dark transition hover:bg-brand/15"><span>Next for you: {next.t}</span><ChevronRight aria-hidden="true" /></button>}
      <div><h3 className="mb-2 font-semibold">Budget</h3><BudgetProposal /></div>
      {s.selectedId && <ConsensusCard />}
    </div>
  )
}

function PurchaseView() {
  const s = useCircleStore()
  const nav = useNavigate()
  const funded = useCircleStore(selectFunded)
  const required = useCircleStore(selectRequired)
  const ready = !!s.selectedId && funded >= required
  const isAdmin = members.find((m) => m.id === ME)?.role === 'admin'
  const root = useRef<HTMLDivElement>(null)
  useGsap((reduced) => { if (ready && !reduced) gsap.fromTo('[data-ready]', { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }) }, root, [ready])
  const start = () => { s.beginPurchase(); nav('/app/circles/sarah/purchasing') }
  return (
    <div ref={root} className="space-y-5 p-4 pb-28 sm:p-6 lg:pb-6">
      <div><h2 className="text-2xl font-semibold">{ready ? 'Ready to Purchase' : 'Purchase'}</h2><p className="mt-1 text-muted">{ready ? 'Every requirement is met.' : 'Everything below must be complete first.'}</p></div>
      <PurchaseChecklist items={[{ label: 'Product selected', done: !!s.selectedId }, { label: 'Group consensus', done: !!s.selectedId }, { label: 'Funding complete', done: ready }, { label: 'Delivery address', done: true }]} />
      <div className="rounded-card border border-slate-200 bg-white p-5 shadow-card"><FundingProgress funded={funded} required={required} /></div>
      {ready && s.phase !== 'done' && <div data-ready className="rounded-2xl border border-ok/25 bg-ok-soft p-4 font-semibold text-ok">Funding {usd(funded)} / {usd(required)} · Ready to Purchase</div>}
      {isAdmin ? (
        <div className="hidden lg:block">
          <Button size="lg" disabled={!ready || s.phase === 'done'} onClick={start} className="w-full">{s.phase === 'done' ? 'Purchase complete' : 'Start Purchase'}</Button>
        </div>
      ) : <p className="text-sm text-muted">Only the Circle admin can start the purchase.</p>}
      <p className="text-sm text-muted">Circle AI will verify the product, price, funding and checkout details before proceeding.</p>
      <label className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-3 text-sm text-muted">
        <input type="checkbox" checked={s.priceChangeDemo} onChange={(e) => s.setPriceChangeDemo(e.target.checked)} className="h-4 w-4 accent-[#0070E0]" />
        Demo: simulate a price change at checkout ($158 total)
      </label>
      {isAdmin && (
        <div className="safe-bottom fixed inset-x-0 bottom-16 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
          <Button size="lg" disabled={!ready || s.phase === 'done'} onClick={start} className="w-full">Start Purchase</Button>
        </div>
      )}
    </div>
  )
}

export default function Workspace() {
  const { id = 'sarah' } = useParams()
  const meta = circles.find((c) => c.id === id)
  const [tab, setTab] = useState<Tab>('chat')
  const [drawer, setDrawer] = useState(false)
  const s = useCircleStore()
  const funded = useCircleStore(selectFunded)
  const required = useCircleStore(selectRequired)
  const states = timelineStates(s.phase)
  const header = useRef<HTMLElement>(null)
  useGsap((reduced) => { if (!reduced) gsap.from('[data-hd]', { y: -12, opacity: 0, duration: 0.6, stagger: 0.06, clearProps: 'all' }) }, header, [])

  if (!meta || id !== 'sarah')
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold">{meta ? `${meta.name} ${meta.emoji}` : 'Circle not found'}</h1>
        <p className="mt-2 text-muted">The full interactive workspace is built for Sarah's Birthday. Other Circles show sample data on the dashboard.</p>
        <Link to="/app/circles/sarah" className={cn(buttonVariants(), 'mt-6')}>Open Sarah's Birthday</Link>
      </div>
    )

  const pulse = (t: Tab) => (t === 'votes' && s.phase === 'voting') || (t === 'funding' && s.phase === 'funding') || (t === 'purchase' && s.phase === 'purchase') || (t === 'products' && s.phase === 'products')
  const view = { overview: <OverviewView go={setTab} />, chat: <CircleChat />, preferences: <div className="space-y-4 p-4 sm:p-6"><h2 className="text-2xl font-semibold">Group preferences</h2><p className="text-muted">Built from the conversation. Circle AI keeps these current.</p><div className="rounded-card border border-slate-200 bg-white p-5 shadow-card"><PreferenceTags avoid={['Perfume', ...s.constraints.filter((c) => !c.startsWith('Avoid')).map((c) => c.replace(/^.*?: /, ''))]} /></div></div>, products: <ProductsView go={setTab} />, votes: <VotingPanel onGoProducts={() => setTab('products')} />, funding: <div className="space-y-5 p-4 sm:p-6"><h2 className="text-2xl font-semibold">Fund the purchase</h2>{s.selectedId ? <><div className="rounded-card border border-slate-200 bg-white p-5 shadow-card"><p className="mb-3 text-sm text-muted">Required: {usd(required)}</p><FundingProgress funded={funded} required={required} large /></div><ContributionCard /></> : <div className="rounded-card border border-dashed border-slate-300 p-10 text-center text-muted">Funding opens once everyone agrees on a product.</div>}</div>, purchase: <PurchaseView /> }[tab]

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:h-dvh">
      <header ref={header} className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link data-hd to="/app" aria-label="Back to dashboard" className="rounded-xl p-2 text-muted hover:bg-slate-100 lg:hidden"><ArrowLeft size={18} /></Link>
          <h1 data-hd className="text-xl font-semibold sm:text-2xl">{meta.name} <span aria-hidden="true">{meta.emoji}</span></h1>
          <span data-hd><StatusPill>{phaseLabel(s.phase)}</StatusPill></span>
          <span data-hd className="hidden sm:block"><AvatarStack ids={members.map((m) => m.id)} /></span>
          <div className="ml-auto flex items-center gap-2">
            <span data-hd className="rounded-xl bg-mist px-3 py-1.5 text-sm"><span className="text-muted">Budget </span><strong><CountUp to={s.budgetAgreed ? s.budget : s.proposedBudget} prefix="$" /></strong></span>
            <Button data-hd variant="secondary" size="sm" className="hidden sm:inline-flex"><UserPlus size={15} aria-hidden="true" />Invite</Button>
            <button data-hd aria-label="Circle settings" className="hidden rounded-xl p-2 text-muted hover:bg-slate-100 sm:block"><Settings size={18} /></button>
            <Button data-hd variant="soft" size="sm" className="xl:hidden" onClick={() => setDrawer(true)}><Gauge size={15} aria-hidden="true" />Intelligence</Button>
          </div>
        </div>
        <nav className="no-scrollbar -mx-4 mt-3 flex gap-1 overflow-x-auto px-4 lg:hidden" aria-label="Circle sections">
          {TABS.map(({ id: t, label }) => <button key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)} className={cn('shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium', tab === t ? 'bg-navy text-white' : 'text-muted hover:bg-slate-100')}>{label}{pulse(t) && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" aria-label="needs attention" />}</button>)}
        </nav>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="hidden w-52 shrink-0 space-y-1 border-r border-slate-200 bg-white p-3 lg:block" aria-label="Circle sections">
          {TABS.map(({ id: t, label, icon: Icon }) => (
            <button key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)} className={cn('flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium transition-colors', tab === t ? 'bg-brand/10 text-brand-dark' : 'text-muted hover:bg-slate-100 hover:text-ink')}>
              <Icon size={18} aria-hidden="true" />{label}
              {pulse(t) && <span className="ml-auto h-2 w-2 rounded-full bg-brand animate-ring" aria-label="needs attention" />}
            </button>
          ))}
          <div className="!mt-6 rounded-2xl bg-mist p-3 text-xs text-muted">{states.filter((x) => x === 'done').length} of 6 steps complete</div>
        </nav>
        <section className="min-w-0 flex-1 overflow-y-auto bg-page" aria-label={TABS.find((t) => t.id === tab)?.label}>{view}</section>
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-mist/60 xl:block" aria-label="Live Circle intelligence">
          <div className="flex items-center gap-2 px-5 pt-5"><AIBadge /><h2 className="font-semibold">Live Circle Intelligence</h2></div>
          <CircleIntelligence />
        </aside>
      </div>
      <Overlay open={drawer} onClose={() => setDrawer(false)} title="Live Circle Intelligence" side="bottom"><CircleIntelligence /></Overlay>
    </div>
  )
}
