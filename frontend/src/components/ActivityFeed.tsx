import { useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useGsap, gsap } from '@/hooks/useGsap'
import { fetchActivity } from '@/api/circles'
import { seedActivity } from '@/data/mock'
import { useCircleStore } from '@/store/circleStore'

/** Animated list: new items slide in from the top. Live events from the Circle store are merged in. */
export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const { data = seedActivity } = useQuery({ queryKey: ['activity'], queryFn: fetchActivity, initialData: seedActivity })
  const messages = useCircleStore((s) => s.messages)
  const events = useMemo(() => messages.filter((m) => m.kind === 'event').slice(-3).reverse(), [messages])
  const root = useRef<HTMLUListElement>(null)
  const items = [...events.map((e) => ({ id: e.id, text: e.text ?? '', circle: "Sarah's Birthday", time: e.time })), ...data].slice(0, limit)
  useGsap((reduced) => {
    if (!reduced) gsap.from('[data-item]', { x: 16, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', clearProps: 'all' })
  }, root, [events.length])
  return (
    <ul ref={root} className="space-y-1">
      {items.map((a) => (
        <li key={a.id} data-item className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-mist">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
          <div className="min-w-0"><p className="text-sm font-medium leading-snug">{a.text}</p><p className="text-xs text-muted">{a.circle} · {a.time}</p></div>
        </li>
      ))}
    </ul>
  )
}
