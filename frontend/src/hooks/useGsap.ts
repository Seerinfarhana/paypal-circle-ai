import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

/** Scoped GSAP context that cleans up on unmount. Callback receives `reduced` so animations can be skipped. */
export function useGsap(
  cb: (reduced: boolean) => void | (() => void),
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => cb(prefersReducedMotion()), scope.current ?? undefined)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
