import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, MessageCircle, ShieldCheck, Sparkles, ShoppingBag, Users, Vote, Wallet } from 'lucide-react'
import { gsap, ScrollTrigger, useGsap } from '@/hooks/useGsap'
import { useLenis } from '@/hooks/useLenis'
import { Logo } from '@/components/ui/Logo'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

/** Hero visual: chat -> AI understanding -> recommendation -> vote -> funding -> PayPal purchase. */
function HeroVisual() {
  const root = useRef<HTMLDivElement>(null)
  useGsap((reduced) => {
    if (reduced) return
    const rows = gsap.utils.toArray<HTMLElement>('[data-flow]')
    const links = gsap.utils.toArray<HTMLElement>('[data-link]')
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.2 })
    rows.forEach((row, i) => {
      tl.fromTo(row, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, i * 0.75)
      if (links[i - 1]) tl.fromTo(links[i - 1], { scaleY: 0 }, { scaleY: 1, duration: 0.4, transformOrigin: 'top' }, i * 0.75 - 0.25)
    })
    tl.fromTo('[data-bar75]', { width: '0%' }, { width: '75%', duration: 0.8, ease: 'power2.out' }, 3 * 0.75 + 0.2)
    tl.fromTo('[data-bar100]', { width: '0%' }, { width: '100%', duration: 0.9, ease: 'power2.out' }, 4 * 0.75 + 0.2)
    tl.fromTo('[data-paid]', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 5 * 0.75)
    tl.to([...rows, ...links], { opacity: 0, duration: 0.6 }, '+=3')
    gsap.to('[data-float]', { y: -8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 })
  }, root, [])
  const row = 'rounded-2xl border border-slate-200 bg-white p-3.5 shadow-card'
  const Link_ = () => <span data-link className="mx-auto block h-4 w-px bg-brand/40" aria-hidden="true" />
  return (
    <div ref={root} className="relative mx-auto w-full max-w-md" aria-label="Illustration of the Circle flow from chat to purchase" role="img">
      <div className="rounded-xl2 bg-gradient-to-b from-mist to-transparent p-4 sm:p-5">
        <div data-flow className={row}><p className="flex items-center gap-2 text-xs font-medium text-muted"><MessageCircle size={14} aria-hidden="true" />Group chat</p><p className="mt-1.5 w-fit rounded-2xl rounded-tl-md bg-mist px-3 py-1.5 text-sm">She loves photography and travels a lot.</p></div>
        <Link_ />
        <div data-flow className={cn(row, 'ai-surface')}><p className="flex items-center gap-2 text-xs font-medium text-brand-dark"><Sparkles size={14} aria-hidden="true" />AI understanding</p><div className="mt-1.5 flex flex-wrap gap-1.5 text-xs font-medium">{['Photography', 'Travel', 'Under $300'].map((t) => <span key={t} className="rounded-full bg-white px-2.5 py-1 text-navy">{t}</span>)}</div></div>
        <Link_ />
        <div data-flow className={row}><div className="flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-medium text-muted"><ShoppingBag size={14} aria-hidden="true" />Recommendation</p><span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">96% match</span></div><p className="mt-1 font-semibold">Portable Photo Printer <span className="font-normal text-muted">· $129</span></p></div>
        <Link_ />
        <div data-flow className={row}><p className="flex items-center justify-between text-xs font-medium text-muted"><span className="flex items-center gap-2"><Vote size={14} aria-hidden="true" />Voting</span><span className="text-navy">3 of 4 approved</span></p><div className="mt-2 h-2 rounded-full bg-slate-100"><div data-bar75 className="h-full w-[75%] rounded-full bg-brand" /></div></div>
        <Link_ />
        <div data-flow className={row}><p className="flex items-center justify-between text-xs font-medium text-muted"><span className="flex items-center gap-2"><Wallet size={14} aria-hidden="true" />Funding</span><span className="text-navy">$150 / $150</span></p><div className="mt-2 h-2 rounded-full bg-slate-100"><div data-bar100 className="h-full w-full rounded-full bg-ok" /></div>
          <p data-paid className="mt-3 flex items-center gap-2 rounded-xl bg-navy px-3 py-2 text-sm font-medium text-white"><Check size={15} aria-hidden="true" />Purchased with PayPal</p></div>
      </div>
      <div data-float className="absolute -right-2 -top-12 hidden w-52 rounded-2xl border border-slate-200 bg-white p-4 shadow-float sm:block lg:-right-10">
        <p className="font-semibold">Sarah's Birthday <span aria-hidden="true">🎂</span></p>
        <dl className="mt-2 space-y-1 text-xs text-muted"><div className="flex justify-between"><dt>Budget</dt><dd className="font-semibold text-ink">$300</dd></div><div className="flex justify-between"><dt>Members</dt><dd className="font-semibold text-ink">4</dd></div><div className="flex justify-between"><dt>Funding</dt><dd className="font-semibold text-ink">$0 / $150</dd></div></dl>
        <div className="mt-3 flex">{['seerin', 'alex', 'john', 'emma'].map((id, i) => <span key={id} data-float className={i ? '-ml-2' : ''}><Avatar id={id} size={26} ring /></span>)}</div>
      </div>
    </div>
  )
}

const stages = [
  { icon: MessageCircle, title: 'Discuss', text: 'Talk it through in the Circle. The AI listens and keeps a shared picture of what everyone wants.' },
  { icon: Vote, title: 'Decide', text: 'Agree on a budget, review AI-matched options and vote. Concerns are heard and the shortlist adapts.' },
  { icon: Wallet, title: 'Fund', text: 'Everyone contributes what they choose through PayPal. Nobody has to chase payments.' },
  { icon: ShoppingBag, title: 'Purchase', text: 'Once approval and funding are complete, the AI agent checks everything and completes the order.' },
]

function Workflow() {
  const root = useRef<HTMLElement>(null)
  useGsap((reduced) => {
    if (reduced) { gsap.set('[data-line]', { scale: 1 }); gsap.set('[data-stage] [data-dot]', { backgroundColor: '#0070E0', color: '#fff' }); return }
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => { gsap.fromTo('[data-line]', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', ease: 'none', scrollTrigger: { trigger: '[data-track]', start: 'top 70%', end: 'bottom 55%', scrub: true } }) })
    mm.add('(max-width: 767px)', () => { gsap.fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '[data-track]', start: 'top 70%', end: 'bottom 60%', scrub: true } }) })
    gsap.utils.toArray<HTMLElement>('[data-stage]').forEach((el) => {
      const tl = gsap.timeline({ paused: true })
      tl.fromTo(el, { opacity: 0.35, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }).to(el.querySelector('[data-dot]'), { backgroundColor: '#0070E0', color: '#fff', duration: 0.3 }, 0)
      ScrollTrigger.create({ trigger: el, start: 'top 80%', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() })
    })
    return () => mm.revert()
  }, root, [])
  return (
    <section ref={root} id="how" className="mx-auto max-w-6xl px-5 py-24">
      <h2 className="max-w-xl text-3xl font-semibold sm:text-4xl">One Circle takes a group from idea to delivery.</h2>
      <p className="mt-3 max-w-xl text-muted">Four stages, each with a clear owner: the group decides, the AI coordinates, and money only moves when conditions are met.</p>
      <div data-track className="relative mt-14">
        <div className="absolute bottom-6 left-6 top-6 w-0.5 bg-slate-200 md:bottom-auto md:left-6 md:right-6 md:top-6 md:h-0.5 md:w-auto" aria-hidden="true"><div data-line className="h-full w-full bg-brand" /></div>
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {stages.map(({ icon: Icon, title, text }) => (
            <li key={title} data-stage className="flex gap-5 md:flex-col md:gap-5">
              <span data-dot className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-brand shadow-card"><Icon size={21} aria-hidden="true" /></span>
              <div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-1.5 text-[15px] text-muted">{text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Landing() {
  useLenis()
  const hero = useRef<HTMLElement>(null)
  useGsap((reduced) => {
    if (reduced) return
    gsap.from('[data-hero] > *', { y: 26, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1 })
  }, hero, [])
  return (
    <div className="bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-1 rounded-full bg-slate-100 p-1 text-sm font-medium md:flex" aria-label="Sections">
            {[['#how', 'How it works'], ['#trust', 'Trust'], ['#start', 'Get started']].map(([h, l]) => <a key={h} href={h} className="rounded-full px-4 py-1.5 text-muted transition hover:bg-white hover:text-ink">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2"><Link to="/auth" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>Sign in</Link><Link to="/auth" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>Create a Circle</Link></div>
        </div>
      </header>

      <section ref={hero} className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mist to-transparent" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div data-hero>
            <h1 className="text-5xl font-semibold leading-[1.04] text-navy sm:text-6xl">Money decisions are better together.</h1>
            <p className="mt-6 max-w-lg text-lg text-muted">Plan, decide, fund and purchase together with an AI agent that understands your group.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/auth" className={cn(buttonVariants({ size: 'lg' }))}>Create a Circle <ArrowRight size={18} aria-hidden="true" /></Link>
              <a href="#how" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>See how it works</a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted"><Users size={16} aria-hidden="true" />For friends, family, roommates and teams</p>
          </div>
          <HeroVisual />
        </div>
      </section>

      <Workflow />

      <section id="trust" className="bg-mist py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3">
          {[
            [ShieldCheck, 'Nothing happens without agreement', 'The agent only purchases after the group approves the product and funding is complete.'],
            [Wallet, 'You choose what you put in', 'Contributions can be unequal. Every amount is visible to the whole Circle.'],
            [Sparkles, 'No silent overspending', 'If the price rises above the approved maximum, the agent stops and asks the group.'],
          ].map(([I, t, d]) => { const Icon = I as typeof ShieldCheck; return (
            <div key={t as string}><Icon className="text-brand" size={26} aria-hidden="true" /><h3 className="mt-4 text-xl font-semibold">{t as string}</h3><p className="mt-2 text-muted">{d as string}</p></div>
          ) })}
        </div>
      </section>

      <section id="start" className="px-5 py-24">
        <div className="navy-surface mx-auto max-w-4xl rounded-xl2 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-semibold sm:text-4xl">Start your first Circle.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">Describe what you're planning. Circle AI sets up the rest.</p>
          <Link to="/auth" className={cn(buttonVariants({ variant: 'light', size: 'lg' }), 'mt-8')}>Create a Circle <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      <footer className="border-t border-slate-100 px-5 py-8 text-center text-sm text-muted">PayPal Circle AI is a hackathon concept. Demo data only.</footer>
    </div>
  )
}
