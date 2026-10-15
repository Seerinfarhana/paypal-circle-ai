import type { ReactNode } from 'react'
import { AIBadge } from './ui/AIThinking'
import { Reactions } from './MessageBubble'
import { PreferenceTags } from './PreferenceTags'
import { BudgetProposal } from './BudgetProposal'
import type { ChatMsg } from '@/store/circleStore'

export function AIMessage({ msg }: { msg: ChatMsg }) {
  let card: ReactNode = null
  if (msg.kind === 'prefs') card = <div className="mt-3 rounded-2xl bg-white p-3.5"><PreferenceTags compact /></div>
  if (msg.kind === 'budget') card = <div className="mt-3"><BudgetProposal /></div>
  return (
    <div data-msg className="group flex gap-2.5">
      <span className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-brand text-white" aria-hidden="true">✦</span>
      <div className="w-full max-w-[88%]">
        <p className="mb-0.5 flex items-center gap-2 text-xs text-muted"><AIBadge />{msg.time}</p>
        <div className="ai-surface rounded-2xl rounded-tl-md p-3.5">
          <p className="text-[15px] leading-snug text-navy">{msg.text}</p>
          {card}
        </div>
        <Reactions msg={msg} />
      </div>
    </div>
  )
}

export function EventMessage({ msg }: { msg: ChatMsg }) {
  return <div data-msg className="mx-auto w-fit rounded-full bg-slate-100 px-3.5 py-1.5 text-center text-xs font-medium text-muted">{msg.text} · {msg.time}</div>
}
