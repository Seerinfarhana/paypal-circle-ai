import { circles, seedActivity, type CircleMeta } from '@/data/mock'

// Mock API layer. Swap these for real fetch calls; hooks using them via TanStack Query stay unchanged.
const delay = <T,>(v: T, ms = 120) => new Promise<T>((r) => setTimeout(() => r(v), ms))
export const fetchCircles = (): Promise<CircleMeta[]> => delay(circles)
export const fetchActivity = () => delay(seedActivity)
