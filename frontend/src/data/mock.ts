import { Aperture, Backpack, BookOpen, Camera, Printer, type LucideIcon } from 'lucide-react'

export interface Member { id: string; name: string; color: string; role: 'admin' | 'member' }
export const ME = 'seerin'
export const members: Member[] = [
  { id: 'seerin', name: 'Seerin', color: '#0B4FB3', role: 'admin' },
  { id: 'alex', name: 'Alex', color: '#6D28D9', role: 'member' },
  { id: 'john', name: 'John', color: '#B45309', role: 'member' },
  { id: 'emma', name: 'Emma', color: '#0F766E', role: 'member' },
]
export const memberById = (id: string) => members.find((m) => m.id === id)!

export interface Product {
  id: string; name: string; price: number; match: number; popular: number
  icon: LucideIcon; tone: string; reasons: string[]; explanation: string
  breakdown: { label: string; value: number }[]
  late?: boolean // appears only after the group's constraints are updated
  finalTotal?: number
}
export const SHIPPING = 10
export const TAX_RATE = 0.085
export const totals = (p: Product) => {
  const tax = Math.round(p.price * TAX_RATE)
  return { price: p.price, shipping: SHIPPING, tax, total: p.price + SHIPPING + tax }
}

export const products: Product[] = [
  {
    id: 'camera', name: 'Compact Instant Camera', price: 119, match: 97, popular: 88, icon: Camera,
    tone: 'from-sky/25 to-brand/10',
    reasons: ['Matches photography interest', 'Travel friendly', 'Within budget', 'Instant prints as keepsakes'],
    explanation: "A small, fun camera that suits Sarah's love of photography and fits in a travel bag.",
    breakdown: [{ label: 'Preference Match', value: 97 }, { label: 'Budget Match', value: 100 }, { label: 'Group Sentiment', value: 94 }, { label: 'Practicality', value: 97 }],
  },
  {
    id: 'printer', name: 'Portable Photo Printer', price: 129, match: 96, popular: 92, icon: Printer,
    tone: 'from-brand/20 to-navy/10', finalTotal: 146.72,
    reasons: ['Matches photography interest', 'Travel friendly', 'Within budget', 'Useful gift'],
    explanation: "This option matches Sarah's interest in photography while remaining portable enough for travel.",
    breakdown: [{ label: 'Preference Match', value: 98 }, { label: 'Budget Match', value: 100 }, { label: 'Group Sentiment', value: 91 }, { label: 'Practicality', value: 94 }],
  },
  {
    id: 'bag', name: 'Slim Travel Camera Bag', price: 89, match: 91, popular: 74, icon: Backpack,
    tone: 'from-mist to-sky/20',
    reasons: ['Matches travel interest', 'Well under budget', 'Useful every trip'],
    explanation: 'Practical and well within budget, though less personal than a photography-specific gift.',
    breakdown: [{ label: 'Preference Match', value: 88 }, { label: 'Budget Match', value: 100 }, { label: 'Group Sentiment', value: 86 }, { label: 'Practicality', value: 96 }],
  },
  {
    id: 'tripod', name: 'Pocket Light Tripod', price: 39, match: 89, popular: 69, icon: Aperture, late: true,
    tone: 'from-sky/20 to-mist',
    reasons: ['Fits photography interest', 'Pocket sized', 'Low risk of duplicates'],
    explanation: 'Added after the group noted Sarah already owns similar gear. Small, useful and unlikely to overlap.',
    breakdown: [{ label: 'Preference Match', value: 90 }, { label: 'Budget Match', value: 100 }, { label: 'Group Sentiment', value: 82 }, { label: 'Practicality', value: 85 }],
  },
  {
    id: 'album', name: 'Travel Photo Album Kit', price: 54, match: 85, popular: 61, icon: BookOpen, late: true,
    tone: 'from-brand/15 to-mist',
    reasons: ['Pairs with her travel photos', 'Thoughtful and personal', 'Within budget'],
    explanation: 'A personal option that turns her travel photos into something she can keep.',
    breakdown: [{ label: 'Preference Match', value: 86 }, { label: 'Budget Match', value: 100 }, { label: 'Group Sentiment', value: 78 }, { label: 'Practicality', value: 76 }],
  },
]
export const productById = (id: string) => products.find((p) => p.id === id)!

export type StepState = 'done' | 'current' | 'todo'
export interface CircleMeta {
  id: string; emoji: string; name: string; status: string; budget: number
  members: string[]; product: string; steps: StepState[]
}
export const stepLabels = ['Budget', 'Preferences', 'Voting', 'Funding', 'Purchase']
export const circles: CircleMeta[] = [
  { id: 'sarah', emoji: '🎂', name: "Sarah's Birthday", status: 'Choosing Gift', budget: 300, members: ['seerin', 'alex', 'john', 'emma'], product: 'Not decided', steps: ['current', 'done', 'todo', 'todo', 'todo'] },
  { id: 'goa', emoji: '🌴', name: 'Goa Trip', status: 'Funding', budget: 1200, members: ['seerin', 'alex', 'emma'], product: 'Beach villa, 3 nights', steps: ['done', 'done', 'done', 'current', 'todo'] },
  { id: 'apartment', emoji: '🛋️', name: 'Apartment Setup', status: 'Voting', budget: 800, members: ['seerin', 'john'], product: 'Sofa shortlist', steps: ['done', 'done', 'current', 'todo', 'todo'] },
  { id: 'farewell', emoji: '🎁', name: 'Farewell Gift', status: 'Setting Budget', budget: 150, members: ['seerin', 'alex', 'john', 'emma'], product: 'Not decided', steps: ['current', 'todo', 'todo', 'todo', 'todo'] },
]

export const seedActivity = [
  { id: 'a1', text: 'Emma approved the $300 budget', circle: "Sarah's Birthday", time: '2m ago' },
  { id: 'a2', text: 'Circle AI found 3 new apartment sofas', circle: 'Apartment Setup', time: '1h ago' },
  { id: 'a3', text: 'Alex contributed $60', circle: 'Goa Trip', time: '3h ago' },
  { id: 'a4', text: 'You joined Farewell Gift', circle: 'Farewell Gift', time: 'Yesterday' },
]
