import { SmilePlus } from 'lucide-react'
import { Avatar } from './ui/Avatar'
import { cn } from '@/lib/utils'
import { memberById, ME } from '@/data/mock'
import { useCircleStore, type ChatMsg } from '@/store/circleStore'

const EMOJI = ['👍', '❤️', '🎉', '😮']

export function Reactions({ msg }: { msg: ChatMsg }) {
  const toggle = useCircleStore((s) => s.toggleReaction)
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {Object.entries(msg.reactions).map(([e, who]) => (
        <button key={e} aria-pressed={who.includes(ME)} aria-label={`${e} reaction, ${who.length}`} onClick={() => toggle(msg.id, e)}
          className={cn('rounded-full border px-2 py-0.5 text-xs transition active:scale-90', who.includes(ME) ? 'border-brand bg-brand/10' : 'border-slate-200 bg-white')}>{e} {who.length}</button>
      ))}
      <span className="flex items-center gap-0.5 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
        <SmilePlus size={14} className="mr-0.5 text-muted" aria-hidden="true" />
        {EMOJI.map((e) => <button key={e} aria-label={`React with ${e}`} onClick={() => toggle(msg.id, e)} className="rounded-md px-1 text-sm hover:bg-slate-100">{e}</button>)}
      </span>
    </div>
  )
}

export function MessageBubble({ msg }: { msg: ChatMsg }) {
  const mine = msg.author === ME
  const m = memberById(msg.author)
  return (
    <div data-msg className={cn('group flex gap-2.5', mine && 'flex-row-reverse')}>
      <Avatar id={msg.author} size={30} />
      <div className={cn('max-w-[78%]', mine && 'flex flex-col items-end')}>
        <p className="mb-0.5 text-xs text-muted">{mine ? 'You' : m.name} · {msg.time}</p>
        <p className={cn('rounded-2xl px-3.5 py-2 text-[15px] leading-snug', mine ? 'rounded-tr-md bg-brand text-white' : 'rounded-tl-md border border-slate-200 bg-white')}>{msg.text}</p>
        <Reactions msg={msg} />
      </div>
    </div>
  )
}
