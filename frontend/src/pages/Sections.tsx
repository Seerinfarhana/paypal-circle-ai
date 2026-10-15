import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bell, CreditCard, Lock } from 'lucide-react'
import { CircleCard } from '@/components/CircleCard'
import { ActivityFeed } from '@/components/ActivityFeed'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button, buttonVariants } from '@/components/ui/Button'
import { fetchCircles } from '@/api/circles'
import { circles as seed, members, products } from '@/data/mock'
import { useCircleStore, selectFunded } from '@/store/circleStore'
import { cn, usd } from '@/lib/utils'
import { useState } from 'react'

const Page = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8"><div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">{title}</h1>{action}</div>{children}</div>
)

export function CirclesPage() {
  const { data = seed } = useQuery({ queryKey: ['circles'], queryFn: fetchCircles, initialData: seed })
  return <Page title="My Circles" action={<Link to="/app/circles/new" className={cn(buttonVariants({ size: 'sm' }))}>New Circle</Link>}><div className="grid gap-4 md:grid-cols-2">{data.map((c) => <CircleCard key={c.id} circle={c} />)}</div></Page>
}

export function ActivityPage() {
  return <Page title="Activity"><Card className="p-3 sm:p-5"><ActivityFeed limit={12} /></Card></Page>
}

export function DiscoverPage() {
  return (
    <Page title="Discover">
      <p className="text-muted">Ideas Circle AI is seeing across popular Circle types.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.filter((p) => !p.late).map((p) => { const I = p.icon; return (
          <Card key={p.id} className="overflow-hidden"><div className={cn('flex h-28 items-center justify-center bg-gradient-to-br', p.tone)}><I size={40} strokeWidth={1.3} className="text-navy/70" aria-hidden="true" /></div><div className="p-4"><p className="font-semibold">{p.name}</p><p className="text-sm text-muted">{usd(p.price)} · popular for birthday Circles</p></div></Card>
        ) })}
      </div>
    </Page>
  )
}

export function PaymentsPage() {
  const s = useCircleStore()
  const funded = useCircleStore(selectFunded)
  return (
    <Page title="Payments">
      <Card className="flex items-center gap-4 p-5"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white"><CreditCard aria-hidden="true" /></span><div><p className="font-semibold">PayPal</p><p className="text-sm text-muted">Linked for contributions (demo)</p></div></Card>
      <Card className="p-5">
        <h2 className="font-semibold">Sarah's Birthday contributions</h2>
        <ul className="mt-3 divide-y divide-slate-100">{members.map((m) => <li key={m.id} className="flex items-center justify-between py-3"><span className="flex items-center gap-3"><Avatar id={m.id} size={28} />{m.name}</span><span className="font-semibold tabular-nums">{usd(s.contributions[m.id] ?? 0)}</span></li>)}</ul>
        <p className="mt-3 text-sm text-muted">Total authorized: {usd(funded)}</p>
      </Card>
    </Page>
  )
}

export function ProfilePage() {
  const [toggles, setToggles] = useState({ votes: true, funding: true, ai: false })
  const rows: [keyof typeof toggles, string, string][] = [['votes', 'Vote reminders', 'When a Circle is waiting on you'], ['funding', 'Funding updates', 'When contributions change'], ['ai', 'AI suggestions', 'New recommendations from Circle AI']]
  return (
    <Page title="Profile & settings">
      <Card className="flex items-center gap-4 p-5"><Avatar id="seerin" size={64} /><div><p className="text-lg font-semibold">Seerin</p><p className="text-sm text-muted">seerin@example.com · Circle admin</p></div></Card>
      <Card className="p-5">
        <h2 className="flex items-center gap-2 font-semibold"><Bell size={17} aria-hidden="true" />Notifications</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {rows.map(([k, t, d]) => (
            <li key={k} className="flex items-center justify-between gap-4 py-3">
              <div><p className="font-medium">{t}</p><p className="text-sm text-muted">{d}</p></div>
              <button role="switch" aria-checked={toggles[k]} aria-label={t} onClick={() => setToggles((v) => ({ ...v, [k]: !v[k] }))} className={cn('relative h-7 w-12 rounded-full transition-colors', toggles[k] ? 'bg-brand' : 'bg-slate-300')}>
                <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', toggles[k] ? 'left-6' : 'left-1')} />
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5"><h2 className="flex items-center gap-2 font-semibold"><Lock size={16} aria-hidden="true" />Delivery address</h2><p className="mt-2 text-sm text-muted">Home · 12 Sample Street (demo address)</p><p className="mt-1 text-xs text-muted">Animations follow your device's reduced-motion setting.</p></Card>
      <Button variant="secondary" onClick={() => useCircleStore.getState().reset()}>Reset demo</Button>
    </Page>
  )
}
