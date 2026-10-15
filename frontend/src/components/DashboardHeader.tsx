import { Bell, Search, Sparkles } from 'lucide-react'
import { Avatar } from './ui/Avatar'
import { Logo } from './ui/Logo'
import { useCircleStore } from '@/store/circleStore'
import { greeting } from '@/lib/utils'

export function DashboardHeader() {
  const setAi = useCircleStore((s) => s.setAi)
  return (
    <header className="flex flex-wrap items-center gap-3 sm:gap-4">
      <div className="lg:hidden"><Logo compact /></div>
      <h1 className="mr-auto text-xl font-semibold sm:text-2xl">{greeting()}, Seerin</h1>
      <div className="relative order-last w-full sm:order-none sm:w-72">
        <label htmlFor="search" className="sr-only">Search Circles, products and people</label>
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input id="search" placeholder="Search Circles, products, people" className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand" />
      </div>
      <button onClick={() => setAi(true, null)} className="flex h-11 items-center gap-2 rounded-2xl bg-brand/10 px-4 text-sm font-semibold text-brand-dark transition hover:bg-brand/15 active:scale-95"><Sparkles size={16} aria-hidden="true" /><span className="hidden sm:inline">Ask Circle AI</span><span className="sr-only sm:hidden">Ask Circle AI</span></button>
      <button aria-label="Notifications, 2 new" className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-muted hover:text-ink">
        <Bell size={19} /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand ring-2 ring-white" aria-hidden="true" />
      </button>
      <span className="hidden sm:block"><Avatar id="seerin" size={44} /></span>
    </header>
  )
}
