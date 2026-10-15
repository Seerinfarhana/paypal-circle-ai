import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AIBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white', className)}>
      <Sparkles size={11} aria-hidden="true" /> Circle AI
    </span>
  )
}

/** Compact "AI is working" state. Dots pause under reduced motion; the label always carries the meaning. */
export function AIThinking({ label = 'Circle AI is thinking', className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn('ai-surface inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-navy', className)}>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-dot rounded-full bg-brand" style={{ animationDelay: `${i * 0.15}s` }} />)}
      </span>
      {label}
    </div>
  )
}

export function StatusPill({ tone = 'brand', children, icon }: { tone?: 'brand' | 'ok' | 'warn' | 'bad' | 'muted'; children: React.ReactNode; icon?: React.ReactNode }) {
  const tones = { brand: 'bg-brand/10 text-brand-dark', ok: 'bg-ok-soft text-ok', warn: 'bg-warn-soft text-warn', bad: 'bg-bad-soft text-bad', muted: 'bg-slate-100 text-muted' }
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', tones[tone])}>{icon}{children}</span>
}
