import { useEffect, useRef, useState } from 'react'
import { AtSign, Paperclip, Send, Smile } from 'lucide-react'
import { gsap } from '@/hooks/useGsap'
import { Avatar } from './ui/Avatar'
import { AIThinking } from './ui/AIThinking'
import { MessageBubble } from './MessageBubble'
import { AIMessage, EventMessage } from './AIMessage'
import { useCircleStore } from '@/store/circleStore'
import { getAnswer } from '@/lib/aiAnswers'
import { ME } from '@/data/mock'
import { cn, prefersReducedMotion } from '@/lib/utils'

const EMOJIS = ['😀', '🎂', '📸', '✈️', '🎉', '👍']

export function CircleChat() {
  const messages = useCircleStore((s) => s.messages)
  const push = useCircleStore((s) => s.pushMessage)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(true)
  const [thinking, setThinking] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const seen = useRef(messages.length)
  const aiActive = /@circleai/i.test(text)

  useEffect(() => { const t = setTimeout(() => setTyping(false), 3200); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const el = list.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    if (!prefersReducedMotion() && messages.length > seen.current) {
      const nodes = el.querySelectorAll('[data-msg]')
      gsap.fromTo(Array.from(nodes).slice(seen.current - messages.length), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)', stagger: 0.06 })
    }
    seen.current = messages.length
  }, [messages.length, thinking, typing])

  const send = () => {
    const t = text.trim()
    if (!t) return
    push({ author: ME, kind: 'text', text: t })
    setText('')
    if (/@circleai/i.test(t)) {
      setThinking(true)
      setTimeout(() => {
        const a = getAnswer(t.replace(/@circleai/gi, ''), useCircleStore.getState())
        push({ author: 'ai', kind: 'ai', text: `${a.title}: ${a.text}${a.rows.length ? ' ' + a.rows.map((r) => `${r.label} — ${r.value}`).join('; ') + '.' : ''}` })
        setThinking(false)
      }, 1400)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={list} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" role="log" aria-live="polite" aria-label="Circle conversation">
        {messages.map((m) => m.kind === 'event' ? <EventMessage key={m.id} msg={m} /> : m.author === 'ai' ? <AIMessage key={m.id} msg={m} /> : <MessageBubble key={m.id} msg={m} />)}
        {thinking && <AIThinking label="Circle AI is reading the conversation" />}
        {typing && (
          <div className="flex items-center gap-2.5 text-xs text-muted" role="status">
            <Avatar id="alex" size={24} /> Alex is typing
            <span className="flex gap-1" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-dot rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
          </div>
        )}
      </div>
      <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
        {emojiOpen && <div className="mb-2 flex gap-1">{EMOJIS.map((e) => <button key={e} aria-label={`Insert ${e}`} onClick={() => { setText((t) => t + e); input.current?.focus() }} className="rounded-lg px-2 py-1 text-xl hover:bg-slate-100">{e}</button>)}</div>}
        <div className={cn('flex items-center gap-1.5 rounded-2xl border bg-white px-2 py-1.5 transition', aiActive ? 'border-brand shadow-[0_0_0_4px_rgba(0,112,224,.12)]' : 'border-slate-200')}>
          <button aria-label="Attach a file" className="rounded-xl p-2 text-muted hover:bg-slate-100"><Paperclip size={18} /></button>
          <button aria-label="Add emoji" aria-expanded={emojiOpen} onClick={() => setEmojiOpen((o) => !o)} className="rounded-xl p-2 text-muted hover:bg-slate-100"><Smile size={18} /></button>
          <label htmlFor="chat-input" className="sr-only">Message the Circle</label>
          <input id="chat-input" ref={input} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Message the Circle, or type @CircleAI" className="h-9 min-w-0 flex-1 bg-transparent px-1 text-[15px] outline-none placeholder:text-slate-400" />
          <button onClick={() => { setText((t) => (t ? t + ' ' : '') + '@CircleAI '); input.current?.focus() }} aria-label="Mention Circle AI" className={cn('flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition', aiActive ? 'bg-brand text-white' : 'bg-brand/10 text-brand-dark hover:bg-brand/15')}><AtSign size={13} aria-hidden="true" />CircleAI</button>
          <button onClick={send} disabled={!text.trim()} aria-label="Send message" className="rounded-xl bg-brand p-2.5 text-white transition active:scale-90 disabled:bg-slate-200 disabled:text-slate-500"><Send size={16} /></button>
        </div>
        {aiActive && <p className="mt-1.5 px-2 text-xs font-medium text-brand-dark">Circle AI is listening. Ask what's pending, who hasn't voted, or about funding.</p>}
      </div>
    </div>
  )
}
