import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { AppSidebar } from './AppSidebar'
import { AICommandPanel } from './AICommandPanel'
import { useCircleStore } from '@/store/circleStore'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { pathname } = useLocation()
  const setAi = useCircleStore((s) => s.setAi)
  const stickyCta = useCircleStore((s) => s.phase === 'purchase') && /^\/app\/circles\/sarah$/.test(pathname)
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="min-h-dvh lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <AppSidebar />
      <main id="main" className="min-w-0 flex-1 pb-16 lg:pb-0"><Outlet /></main>
      <button onClick={() => setAi(true, null)} aria-label="Open Circle AI assistant"
        className={cn('fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-navy to-brand text-white shadow-float transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-110 active:scale-95 lg:bottom-6 lg:right-6', stickyCta ? 'bottom-[9.5rem]' : 'bottom-20')}>
        <Sparkles size={22} />
      </button>
      <AICommandPanel />
    </div>
  )
}
