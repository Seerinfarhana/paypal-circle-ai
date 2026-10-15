import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, Check, Sparkles } from 'lucide-react'
import { gsap, useGsap } from '@/hooks/useGsap'
import { AIThinking } from '@/components/ui/AIThinking'
import { Button } from '@/components/ui/Button'

const CHIPS: [string, string][] = [
  ['Birthday Gift', "Sarah's birthday is next month. Four of us want to buy her something under $300…"],
  ['Trip', 'Six of us are planning a weekend trip and want to split about $1,200 for the stay…'],
  ['Group Dinner', 'We are planning a group dinner for five people with a budget around $250…'],
  ['Roommate Purchase', 'Three roommates need a new sofa and want to stay under $800…'],
  ['Event', 'We are organising a team event for eight people and want to keep it under $600…'],
  ['Custom', ''],
]
const NUM: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }

/** Mock extraction. Replace with the AI parse endpoint later. */
function analyse(t: string) {
  const budget = t.match(/\$\s?([\d,]+)/)?.[1]
  const word = Object.keys(NUM).find((w) => new RegExp(`\\b${w}\\b`, 'i').test(t))
  const digit = t.match(/\b(\d{1,2})\s+(?:of us|people|friends|members)/i)?.[1]
  const name = t.match(/([A-Z][a-z]+)'s\s+(birthday|farewell|wedding)/i)
  const needs = /birthday/i.test(t) ? ['Gift', 'Cake', 'Dinner'] : /trip/i.test(t) ? ['Stay', 'Travel', 'Food'] : /sofa|roommate/i.test(t) ? ['Furniture', 'Delivery'] : ['Purchase', 'Shared costs']
  return {
    purpose: name ? `${name[1]}'s ${name[2][0].toUpperCase()}${name[2].slice(1).toLowerCase()}` : t.split(/[.,…]/)[0].slice(0, 44) || 'Group plan',
    members: word ? NUM[word.toLowerCase()] : digit ? Number(digit) : 4,
    budget: budget ? `Around $${budget}` : 'To be agreed',
    needs,
  }
}

export default function CreateCircle() {
  const [text, setText] = useState('')
  const [stage, setStage] = useState<'compose' | 'thinking' | 'result'>('compose')
  const [result, setResult] = useState<ReturnType<typeof analyse> | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const nav = useNavigate()

  const submit = () => {
    if (!text.trim()) return
    setStage('thinking')
    gsap.to('[data-composer]', { scale: 0.96, y: -8, duration: 0.4, ease: 'power2.in' })
    setTimeout(() => { setResult(analyse(text)); setStage('result') }, 1500)
  }
  useGsap((reduced) => {
    if (stage !== 'result' || reduced) return
    const tl = gsap.timeline()
    tl.fromTo('[data-result]', { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' })
      .fromTo('[data-field]', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.12 }, '-=0.2')
    gsap.fromTo('[data-source]', { opacity: 1 }, { opacity: 0.55, duration: 0.5 })
  }, root, [stage])

  return (
    <div ref={root} className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col justify-center gap-6 p-4 sm:p-6 lg:min-h-dvh">
      <h1 className="text-center text-3xl font-semibold sm:text-4xl">What are you planning together?</h1>
      <div data-composer data-source className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
        <label htmlFor="plan" className="sr-only">Describe what you're planning</label>
        <textarea id="plan" rows={4} value={text} onChange={(e) => setText(e.target.value)} disabled={stage !== 'compose'} placeholder="Sarah's birthday is next month. Four of us want to buy her something under $300…" className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-slate-400" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted"><Sparkles size={14} className="text-brand" aria-hidden="true" />Circle AI will structure this for you</span>
          <button onClick={submit} disabled={!text.trim() || stage !== 'compose'} aria-label="Analyse with Circle AI" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white transition active:scale-90 disabled:bg-slate-200 disabled:text-slate-500"><ArrowUp size={19} /></button>
        </div>
      </div>
      {stage === 'compose' && (
        <ul className="flex flex-wrap justify-center gap-2" aria-label="Quick starts">
          {CHIPS.map(([l, t]) => <li key={l}><button onClick={() => setText(t)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-brand/50 active:scale-95">{l}</button></li>)}
        </ul>
      )}
      {stage === 'thinking' && <div className="flex justify-center"><AIThinking label="Reading your plan" /></div>}
      {stage === 'result' && result && (
        <div data-result className="ai-surface rounded-xl2 p-6">
          <p className="mb-4 flex items-center gap-2 font-semibold text-navy"><Sparkles size={16} className="text-brand" aria-hidden="true" />AI understood</p>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div data-field><dt className="text-sm text-muted">Purpose</dt><dd className="font-semibold">{result.purpose}</dd></div>
            <div data-field><dt className="text-sm text-muted">Members</dt><dd className="font-semibold">{result.members}</dd></div>
            <div data-field><dt className="text-sm text-muted">Initial Budget</dt><dd className="font-semibold">{result.budget}</dd></div>
            <div data-field><dt className="text-sm text-muted">Possible Needs</dt><dd className="mt-1 flex flex-wrap gap-1.5">{result.needs.map((n) => <span key={n} className="rounded-full bg-white px-2.5 py-0.5 text-sm font-medium">{n}</span>)}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => nav('/app/circles/sarah')}><Check size={17} aria-hidden="true" />Looks right</Button>
            <Button variant="secondary" onClick={() => setStage('compose')}>Edit details</Button>
          </div>
        </div>
      )}
    </div>
  )
}
