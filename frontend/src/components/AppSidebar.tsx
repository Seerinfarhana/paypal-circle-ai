import { NavLink, useLocation } from 'react-router-dom'
import { Activity, CircleDot, Compass, CreditCard, HelpCircle, Home, Settings, User } from 'lucide-react'
import { Logo } from './ui/Logo'
import { Avatar } from './ui/Avatar'
import { useCircleStore } from '@/store/circleStore'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/circles', label: 'My Circles', icon: CircleDot },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/activity', label: 'Activity', icon: Activity },
  { to: '/app/payments', label: 'Payments', icon: CreditCard },
  { to: '/app/profile', label: 'Profile', icon: User },
]

export function useCompactNav() {
  return /^\/app\/circles\/(?!new)[^/]+/.test(useLocation().pathname)
}

export function AppSidebar() {
  const compact = useCompactNav()
  const setAi = useCircleStore((s) => s.setAi)
  const item = (compact: boolean) => ({ isActive }: { isActive: boolean }) =>
    cn('flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium transition-colors', compact && 'justify-center px-0', isActive ? 'bg-brand/10 text-brand-dark' : 'text-muted hover:bg-slate-100 hover:text-ink')
  return (
    <>
      <aside className={cn('sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex', compact ? 'w-[76px]' : 'w-64')} aria-label="Primary">
        <div className={cn('mb-8 mt-1 px-1', compact && 'flex justify-center px-0')}><Logo compact={compact} /></div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} title={label} aria-label={label} className={item(compact)}>
              <Icon size={19} aria-hidden="true" />{!compact && label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-slate-100 pt-3">
          <NavLink to="/app/profile" title="Settings" aria-label="Settings" className={item(compact)}><Settings size={19} aria-hidden="true" />{!compact && 'Settings'}</NavLink>
          <button onClick={() => setAi(true, null)} title="Help" aria-label="Help" className={cn(item(compact)({ isActive: false }), 'w-full')}><HelpCircle size={19} aria-hidden="true" />{!compact && 'Help'}</button>
          <div className={cn('mt-2 flex items-center gap-3 rounded-2xl bg-mist p-2.5', compact && 'justify-center bg-transparent p-0')}>
            <Avatar id="seerin" size={compact ? 34 : 36} />
            {!compact && <div className="min-w-0"><p className="truncate text-sm font-semibold">Seerin</p><p className="truncate text-xs text-muted">Circle admin</p></div>}
          </div>
        </div>
      </aside>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden" aria-label="Primary">
        <ul className="grid h-16 grid-cols-5">
          {[nav[0], nav[1], nav[3], nav[4], nav[5]].map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={({ isActive }) => cn('flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium', isActive ? 'text-brand-dark' : 'text-muted')}>
                <Icon size={21} aria-hidden="true" />{label === 'My Circles' ? 'Circles' : label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
