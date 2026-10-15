import { Heart, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { likes?: string[]; avoid?: string[]; compact?: boolean }
export const defaultLikes = ['Photography', 'Travel', 'Useful products', 'Portable']
export function PreferenceTags({ likes = defaultLikes, avoid = ['Perfume'], compact }: Props) {
  const tag = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'
  return (
    <div className={cn('space-y-3', compact && 'space-y-2')}>
      <div>
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ok"><Heart size={12} aria-hidden="true" />Likes</p>
        <ul className="flex flex-wrap gap-1.5">{likes.map((l) => <li key={l} className={cn(tag, 'bg-ok-soft text-ok')}>{l}</li>)}</ul>
      </div>
      <div>
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-bad"><Ban size={12} aria-hidden="true" />Avoid</p>
        <ul className="flex flex-wrap gap-1.5">{avoid.map((l) => <li key={l} className={cn(tag, 'bg-bad-soft text-bad')}>{l}</li>)}</ul>
      </div>
    </div>
  )
}
