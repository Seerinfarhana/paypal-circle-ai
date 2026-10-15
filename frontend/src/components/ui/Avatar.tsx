import { memberById } from '@/data/mock'
import { cn } from '@/lib/utils'

interface Props { id: string; size?: number; glow?: boolean; ring?: boolean; className?: string }
export function Avatar({ id, size = 32, glow, ring, className }: Props) {
  const m = memberById(id)
  return (
    <span
      title={m.name}
      aria-label={m.name}
      data-avatar={id}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-0.5 hover:scale-110',
        ring && 'ring-2 ring-white', glow && 'shadow-[0_0_0_4px_rgba(0,112,224,.28)]', className,
      )}
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.4 }}
    >
      {m.name[0]}
    </span>
  )
}

export function AvatarStack({ ids, size = 28 }: { ids: string[]; size?: number }) {
  return (
    <div className="flex items-center" role="group" aria-label={`${ids.length} members`}>
      {ids.map((id, i) => <Avatar key={id} id={id} size={size} ring className={i ? '-ml-2' : ''} />)}
    </div>
  )
}
