import { type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...p }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-card border border-slate-200/80 bg-white shadow-card', className)} {...p} />
}

/** Card with a cursor-following glow and a slight lift (magic-bento inspired, kept restrained). */
export function SpotlightCard({ className, onMouseMove, ...p }: HTMLAttributes<HTMLDivElement>) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
    onMouseMove?.(e)
  }
  return <div onMouseMove={move} className={cn('spot rounded-card border border-slate-200/80 bg-white shadow-card', className)} {...p} />
}
