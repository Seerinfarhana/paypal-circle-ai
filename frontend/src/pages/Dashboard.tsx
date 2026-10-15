import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Plus, Sparkles, Truck } from 'lucide-react'
import { gsap, useGsap } from '@/hooks/useGsap'
import { useLenis } from '@/hooks/useLenis'
import { DashboardHeader } from '@/components/DashboardHeader'
import { CircleCard } from '@/components/CircleCard'
import { ActivityFeed } from '@/components/ActivityFeed'
import { FundingProgress } from '@/components/FundingProgress'
import { SpotlightCard } from '@/components/ui/Card'
import { CountUp } from '@/components/ui/CountUp'
import { AvatarStack } from '@/components/ui/Avatar'
import { buttonVariants } from '@/components/ui/Button'
import { fetchCircles } from '@/api/circles'
import { circles as seedCircles, productById } from '@/data/mock'
import { useCircleStore, selectFunded, selectRequired } from '@/store/circleStore'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  useLenis()
  const { data: circles = seedCircles } = useQuery({ queryKey: ['circles'], queryFn: fetchCircles, initialData: seedCircles })
  const s = useCircleStore()
  const funded = useCircleStore(selectFunded)
  const required = useCircleStore(selectRequired)
  const root = useRef<HTMLDivElement>(null)
  const done = s.phase === 'done'
  const pendingVotes = 2 + (s.phase === 'voting' && s.activeVoteId && s.votes[s.activeVoteId]?.seerin === 'pending' ? 1 : 0)
  const stats = [
    { label: 'Active Circles', value: done ? 3 : 4 },
    { label: 'Awaiting Your Vote', value: pendingVotes },
    { label: 'Funding Required', value: s.selectedId && !done ? Math.max(required - funded, 0) : 1, prefix: s.selectedId && !done ? '$' : '' },
    { label: 'Purchases Completed', value: done ? 8 : 7 },
  ]
  useGsap((reduced) => {
    if (reduced) return
    gsap.from('[data-enter]', { y: 22, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'all' })
  }, root, [])

  return (
    <div ref={root} className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div data-enter><DashboardHeader /></div>

      <section data-enter className="navy-surface rounded-xl2 p-6 text-white sm:p-8" aria-labelledby="your-circles">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="your-circles" className="text-2xl font-semibold">Your Circles</h2>
          <Link to="/app/circles/new" className={cn(buttonVariants({ variant: 'light', size: 'sm' }))}><Plus size={16} aria-hidden="true" />New Circle</Link>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((st) => (
            <div key={st.label}><dd className="text-4xl font-semibold"><CountUp to={st.value} prefix={st.prefix} /></dd><dt className="mt-1 text-sm text-white/75">{st.label}</dt></div>
          ))}
        </dl>
      </section>

      <section data-enter className="grid gap-4 lg:grid-cols-4" aria-label="Circle intelligence">
        <SpotlightCard className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Active Circles</h3>
          <ul className="mt-4 space-y-3">
            {circles.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                <Link to={`/app/circles/${c.id}`} className="font-medium hover:text-brand-dark">{c.emoji} {c.name}</Link>
                <span className="flex items-center gap-3"><span className="text-muted">{c.id === 'sarah' ? ({ budget: 'Setting Budget', products: 'Choosing Gift', voting: 'Voting', funding: 'Funding', purchase: 'Ready to Purchase', done: 'Purchased' } as const)[s.phase] : c.status}</span><AvatarStack ids={c.members} size={22} /></span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
        <SpotlightCard className="p-5">
          <h3 className="font-semibold">Pending Votes</h3>
          <p className="mt-3 text-4xl font-semibold"><CountUp to={pendingVotes} /></p>
          <p className="mt-1 text-sm text-muted">Across your Circles</p>
          <Link to="/app/circles/sarah" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">Review <ArrowRight size={14} aria-hidden="true" /></Link>
        </SpotlightCard>
        <SpotlightCard className="p-5">
          <h3 className="mb-4 font-semibold">Funding Progress</h3>
          {s.selectedId ? <FundingProgress funded={funded} required={required} /> : <p className="text-sm text-muted">Funding opens once a product is agreed.</p>}
        </SpotlightCard>
        <SpotlightCard className="ai-surface p-5 lg:col-span-2">
          <h3 className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-brand" aria-hidden="true" />AI Suggestions</h3>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li>{s.rejected.length ? 'Pocket Light Tripod ($39) fits Sarah\'s Birthday and avoids duplicates.' : 'Portable Photo Printer is a 96% match for Sarah\'s Birthday.'}</li>
            <li>Goa Trip is $200 short of its villa deposit.</li>
            <li>Apartment Setup has 3 new sofa picks under $800.</li>
          </ul>
        </SpotlightCard>
        <SpotlightCard className="p-5">
          <h3 className="font-semibold">Upcoming Purchase</h3>
          {done ? <p className="mt-3 flex items-center gap-2 text-sm font-medium text-ok"><Truck size={16} aria-hidden="true" />Arriving Oct 22</p> : s.phase === 'purchase' ? <p className="mt-3 text-sm">Portable Photo Printer is ready. The admin can start the purchase.</p> : <p className="mt-3 text-sm text-muted">{s.selectedId ? `${productById(s.selectedId).name} awaits funding.` : 'Nothing queued yet.'}</p>}
        </SpotlightCard>
        <SpotlightCard className="p-5">
          <h3 className="mb-2 font-semibold">Recent Activity</h3>
          <ActivityFeed limit={3} />
        </SpotlightCard>
      </section>

      <section data-enter aria-labelledby="circle-list">
        <div className="mb-4 flex items-center justify-between"><h2 id="circle-list" className="text-xl font-semibold">Active Circles</h2></div>
        <div className="grid gap-4 md:grid-cols-2">{circles.map((c) => <CircleCard key={c.id} circle={c} />)}</div>
      </section>
    </div>
  )
}
