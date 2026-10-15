import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckItem { label: string; done: boolean }
export function PurchaseChecklist({ items }: { items: CheckItem[] }) {
  return (
    <ul className="space-y-2" aria-label="Purchase requirements">
      {items.map((i) => (
        <li key={i.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
          <span className="flex items-center gap-3 font-medium">
            <span className={cn('flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-500', i.done ? 'bg-ok text-white' : 'border-2 border-slate-300 text-slate-300')}>
              {i.done ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : <Circle size={0} aria-hidden="true" />}
            </span>{i.label}
          </span>
          <span className={cn('text-sm font-medium', i.done ? 'text-ok' : 'text-muted')}>{i.done ? 'Complete' : 'Waiting'}</span>
        </li>
      ))}
    </ul>
  )
}
