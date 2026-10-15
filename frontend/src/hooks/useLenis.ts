import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './useGsap'
import { prefersReducedMotion } from '@/lib/utils'

/** Smooth scrolling for the landing page and long dashboard views. Disabled for reduced motion. */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [enabled])
}
