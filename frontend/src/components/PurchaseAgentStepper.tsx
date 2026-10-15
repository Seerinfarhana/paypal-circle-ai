import { useRef } from 'react'
import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import { useGsap, gsap } from '@/hooks/useGsap'
import { cn } from '@/lib/utils'

export const AGENT_STEPS = [
  'Verifying selected product', 'Checking current price', 'Confirming availability', 'Validating group approval',
  'Checking funding', 'Preparing PayPal checkout', 'Completing purchase',
]

/** `active` = index running now; steps before it are done. `failed` marks a blocked step. */
export function PurchaseAgentStepper({ active, failed }: { active: number; failed?: number }) {
  const root = useRef<HTMLOListElement>(null)
  useGsap((reduced) => {
    if (reduced) return
    gsap.fromTo(`[data-step="${active - 1}"] [data-done]`, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.5)' })
    gsap.fromTo(`[data-step="${active}"]`, { x: -6 }, { x: 0, duration: 0.4, ease: 'power2.out' })
  }, root, [active])
  return (
    <ol ref={root} className="space-y-1" aria-label="Purchase steps">
      {AGENT_STEPS.map((label, i) => {
        const state = failed === i ? 'failed' : i < active ? 'done' : i === active ? 'active' : 'todo'
        return (
          <li key={label} data-step={i} className={cn('flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors duration-500', state === 'active' && 'bg-mist', state === 'failed' && 'bg-warn-soft')}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center">
              {state === 'done' && <span data-done className="flex h-7 w-7 items-center justify-center rounded-full bg-ok text-white"><Check size={15} strokeWidth={3} aria-hidden="true" /></span>}
              {state === 'active' && <Loader2 size={22} className="animate-spin text-brand motion-reduce:animate-none" aria-hidden="true" />}
              {state === 'failed' && <AlertTriangle size={22} className="text-warn" aria-hidden="true" />}
              {state === 'todo' && <span className="h-3 w-3 rounded-full border-2 border-slate-300" aria-hidden="true" />}
            </span>
            <span className={cn('font-medium', state === 'todo' ? 'text-muted' : 'text-ink')}>{label}</span>
            <span className="ml-auto text-xs font-medium text-muted">{state === 'done' ? 'Done' : state === 'active' ? 'In progress' : state === 'failed' ? 'Needs attention' : 'Queued'}</span>
          </li>
        )
      })}
    </ol>
  )
}
