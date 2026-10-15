import { useRef } from 'react'
import { Check } from 'lucide-react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { cn } from '@/lib/utils'
import type { StepState } from '@/data/mock'

interface Props { labels: string[]; states: StepState[]; className?: string }

/** Horizontal progress. State is shown by icon + text, never color alone. */
export function CircleProgress({ labels, states, className }: Props) {
  const fill = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLOListElement>(null)
  const done = states.filter((s) => s === 'done').length
  const pct = ((done + (states.includes('current') ? 0.5 : 0)) / Math.max(labels.length - 1, 1)) * 100
  useGsap((reduced) => {
    gsap.to(fill.current, { width: `${Math.min(pct, 100)}%`, duration: reduced ? 0 : 0.9, ease: 'power3.out' })
  }, root, [pct])
  return (
    <ol ref={root} className={cn('relative flex justify-between', className)} aria-label="Circle progress">
      <div className="absolute left-3 right-3 top-3 h-0.5 rounded bg-slate-200" aria-hidden="true">
        <div ref={fill} className="h-full w-0 rounded bg-brand" />
      </div>
      {labels.map((l, i) => (
        <li key={l} className="relative z-10 flex flex-col items-center gap-1.5">
          <span
            className={cn('flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white text-white',
              states[i] === 'done' && 'border-brand bg-brand',
              states[i] === 'current' && 'border-brand animate-ring',
              states[i] === 'todo' && 'border-slate-300')}
          >
            {states[i] === 'done' && <Check size={13} strokeWidth={3} aria-hidden="true" />}
            {states[i] === 'current' && <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />}
          </span>
          <span className={cn('text-[11px] font-medium', states[i] === 'todo' ? 'text-muted' : 'text-ink')}>
            {l}<span className="sr-only">, {states[i] === 'done' ? 'complete' : states[i] === 'current' ? 'in progress' : 'not started'}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
