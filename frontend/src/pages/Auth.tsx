import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function Auth() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const nav = useNavigate()
  const go = (e: React.FormEvent) => { e.preventDefault(); nav('/app') }
  const field = 'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand'
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="navy-surface hidden flex-col justify-between p-12 text-white lg:flex">
        <Logo light />
        <div><p className="max-w-md text-4xl font-semibold leading-tight">Plan it together. Pay it together. Done.</p><p className="mt-4 max-w-sm text-white/75">Circle AI keeps the group aligned from first idea to delivery.</p></div>
        <p className="text-sm text-white/60">Demo environment. No real payments.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1" role="tablist">
            {(['in', 'up'] as const).map((m) => <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cn('rounded-xl py-2 text-sm font-medium transition', mode === m ? 'bg-white shadow-sm' : 'text-muted')}>{m === 'in' ? 'Sign in' : 'Create account'}</button>)}
          </div>
          <h1 className="text-2xl font-semibold">{mode === 'in' ? 'Welcome back' : 'Create your account'}</h1>
          <form onSubmit={go} className="mt-6 space-y-3">
            {mode === 'up' && <><label className="sr-only" htmlFor="name">Full name</label><input id="name" className={field} placeholder="Full name" /></>}
            <label className="sr-only" htmlFor="email">Email</label><input id="email" type="email" className={field} placeholder="Email" defaultValue="seerin@example.com" />
            <label className="sr-only" htmlFor="pw">Password</label><input id="pw" type="password" className={field} placeholder="Password" defaultValue="demo-password" />
            <Button type="submit" size="lg" className="w-full">{mode === 'in' ? 'Sign in' : 'Create account'}</Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
          <Button variant="navy" size="lg" className="w-full" onClick={() => nav('/app')}>Continue with PayPal</Button>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock size={12} aria-hidden="true" />Demo sign-in. Real PayPal login replaces this later.</p>
          <p className="mt-4 text-center text-sm"><Link to="/" className="text-brand-dark hover:underline">Back to home</Link></p>
        </div>
      </div>
    </div>
  )
}
