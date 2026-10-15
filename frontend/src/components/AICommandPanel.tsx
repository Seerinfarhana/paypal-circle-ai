import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Overlay } from './ui/Overlay'
import { AIBadge, AIThinking } from './ui/AIThinking'
import { useCircleStore } from '@/store/circleStore'
import { getAnswer, QUICK_PROMPTS, type Answer } from '@/lib/aiAnswers'
import { cn } from '@/lib/utils'

interface Turn { q: string; a?: Answer }

export function AnswerCard({ a }: { a: Answer }) {
  return (
    <div className="ai-surface rounded-2xl p-4">
      <AIBadge />
      <p className="mt-2 font-semibold text-navy">{a.title}</p>
      <p className="text-sm text-muted">{a.text}</p>
      {a.rows.length > 0 && (
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl bg-white text-sm">
          {a.rows.map((r) => (
            <li key={r.label} className="flex justify-between gap-3 px-3 py-2">
              <span>{r.label}</span>
              <span className={cn('font-semibold', r.tone === 'ok' && 'text-ok', r.tone === 'wait' && 'text-warn', r.tone === 'bad' && 'text-bad')}>{r.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function AICommandPanel() {
  const open = useCircleStore((s) => s.aiOpen)
  const prompt = useCircleStore((s) => s.aiPrompt)
  const setAi = useCircleStore((s) => s.setAi)
  const [turns, setTurns] = useState<Turn[]>([])
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)

  const ask = (q: string) => {
    if (!q.trim()) return
    setTurns((t) => [...t, { q }])
    setText('')
    setTimeout(() => setTurns((t) => t.map((x, i) => (i === t.length - 1 && !x.a ? { ...x, a: getAnswer(q, useCircleStore.getState()) } : x))), 900)
  }
  useEffect(() => { if (open && prompt) ask(prompt) }, [open, prompt])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [turns])

  return (
    <Overlay open={open} onClose={() => setAi(false)} title="Circle AI" side="right" className="!max-w-md">
      <div className="flex min-h-full flex-col">
        <div className="flex-1 space-y-4 px-5 pb-4">
          {!turns.length && <p className="text-sm text-muted">Ask about this Circle. Answers use what the group has said, voted and funded so far.</p>}
          {turns.map((t, i) => (
            <div key={i} className="space-y-3">
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-brand px-3.5 py-2 text-[15px] text-white">{t.q}</p>
              {t.a ? <AnswerCard a={t.a} /> : <AIThinking label="Checking the Circle" />}
            </div>
          ))}
          <div ref={end} />
        </div>
        <div className="sticky bottom-0 border-t border-slate-100 bg-white p-4">
          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
            {QUICK_PROMPTS.map((p) => <button key={p} onClick={() => ask(p)} className="shrink-0 rounded-full border border-brand/25 bg-white px-3 py-1.5 text-sm font-medium text-navy hover:bg-mist active:scale-95">{p}</button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(text) }} className="flex gap-2">
            <label htmlFor="ai-q" className="sr-only">Ask Circle AI</label>
            <input id="ai-q" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Circle AI…" className="h-11 flex-1 rounded-2xl border border-slate-200 px-4 outline-none focus:border-brand" />
            <button aria-label="Send question" disabled={!text.trim()} className="rounded-2xl bg-brand px-4 text-white disabled:bg-slate-200 disabled:text-slate-500"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </Overlay>
  )
}
