import { useMemo } from 'react'
import { create } from 'zustand'
import { ME, members, productById, totals } from '@/data/mock'

export type Vote = 'approve' | 'decline' | 'pending'
export type Phase = 'budget' | 'products' | 'voting' | 'funding' | 'purchase' | 'done'
export type PurchaseStatus = 'idle' | 'running' | 'price-changed' | 'done'
export type DeclineStage = 'none' | 'asking' | 'thinking' | 'done'

export interface ChatMsg {
  id: string
  author: string // member id | 'ai' | 'system'
  kind: 'text' | 'ai' | 'prefs' | 'budget' | 'event'
  text?: string
  time: string
  reactions: Record<string, string[]>
}
type NewMsg = Omit<ChatMsg, 'id' | 'time' | 'reactions'>

let n = 100
const now = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const msg = (m: NewMsg, time?: string): ChatMsg => ({ ...m, id: `m${n++}`, time: time ?? now(), reactions: {} })

const seed: ChatMsg[] = [
  msg({ author: 'seerin', kind: 'text', text: 'She loves photography.' }, '9:41'),
  msg({ author: 'alex', kind: 'text', text: 'She travels a lot too.' }, '9:42'),
  msg({ author: 'john', kind: 'text', text: "I don't think perfume would be useful." }, '9:42'),
  msg({ author: 'ai', kind: 'prefs', text: "I've updated the group's preference profile." }, '9:43'),
  msg({ author: 'seerin', kind: 'text', text: 'I suggest $300.' }, '9:45'),
  msg({ author: 'alex', kind: 'text', text: 'I would say $250.' }, '9:45'),
  msg({ author: 'john', kind: 'text', text: '$350 gives us more room.' }, '9:46'),
  msg({ author: 'emma', kind: 'text', text: '$300 works for me.' }, '9:46'),
  msg({ author: 'ai', kind: 'budget', text: 'Most suggestions are around $300. Would you like to set the Circle budget to $300?' }, '9:47'),
]

export const DECLINE_REASONS = ['Too expensive', 'Already owns something similar', "Doesn't match recipient", 'Prefer another option', 'Other']

interface State {
  phase: Phase
  messages: ChatMsg[]
  // budget
  budget: number
  proposedBudget: number
  budgetApprovals: Record<string, boolean>
  budgetAgreed: boolean
  // products & votes
  votes: Record<string, Record<string, Vote>>
  activeVoteId: string | null
  selectedId: string | null
  rejected: string[]
  pendingRejectTransition: boolean
  declineStage: DeclineStage
  declineMember: string | null
  constraints: string[]
  // funding
  contributions: Record<string, number>
  contributionOrder: string[]
  lastContribution: { memberId: string; amount: number; nonce: number } | null
  fundingTarget: number | null
  // purchase
  purchase: PurchaseStatus
  priceChangeDemo: boolean
  // ai panel
  aiOpen: boolean
  aiPrompt: string | null
}

interface Actions {
  pushMessage: (m: NewMsg) => void
  toggleReaction: (id: string, emoji: string, memberId?: string) => void
  approveBudget: (memberId: string) => void
  proposeBudget: (amount: number) => void
  startVote: (productId: string) => void
  castVote: (productId: string, memberId: string, v: Vote) => void
  simulateJohn: (productId: string) => void
  answerDecline: (reason: string) => void
  clearRejectTransition: () => void
  contribute: (memberId: string, amount: number) => void
  setPriceChangeDemo: (v: boolean) => void
  beginPurchase: () => void
  flagPriceChange: () => void
  finishPurchase: () => void
  requestExtraFunding: () => void
  setAi: (open: boolean, prompt?: string | null) => void
  reset: () => void
}

const initial = (): State => ({
  phase: 'budget',
  messages: seed,
  budget: 300,
  proposedBudget: 300,
  budgetApprovals: { seerin: true, alex: true, emma: true, john: false },
  budgetAgreed: false,
  votes: {},
  activeVoteId: null,
  selectedId: null,
  rejected: [],
  pendingRejectTransition: false,
  declineStage: 'none',
  declineMember: null,
  constraints: ['Avoid: Perfume'],
  contributions: { seerin: 50, alex: 40, john: 0, emma: 0 },
  contributionOrder: ['seerin', 'alex'],
  lastContribution: null,
  fundingTarget: null,
  purchase: 'idle',
  priceChangeDemo: false,
  aiOpen: false,
  aiPrompt: null,
})

export const useCircleStore = create<State & Actions>((set, get) => ({
  ...initial(),

  pushMessage: (m) => set((s) => ({ messages: [...s.messages, msg(m)] })),

  toggleReaction: (id, emoji, memberId = ME) =>
    set((s) => ({
      messages: s.messages.map((m) => {
        if (m.id !== id) return m
        const who = m.reactions[emoji] ?? []
        const next = who.includes(memberId) ? who.filter((w) => w !== memberId) : [...who, memberId]
        const reactions = { ...m.reactions, [emoji]: next }
        if (!next.length) delete reactions[emoji]
        return { ...m, reactions }
      }),
    })),

  approveBudget: (memberId) => {
    const s = get()
    const approvals = { ...s.budgetApprovals, [memberId]: true }
    const agreed = members.every((m) => approvals[m.id])
    set({
      budgetApprovals: approvals,
      budgetAgreed: agreed,
      phase: agreed && s.phase === 'budget' ? 'products' : s.phase,
      budget: agreed ? s.proposedBudget : s.budget,
      messages: agreed
        ? [...s.messages, msg({ author: 'system', kind: 'event', text: `Budget agreed — $${s.proposedBudget}` })]
        : s.messages,
    })
  },

  proposeBudget: (amount) => {
    const s = get()
    set({
      proposedBudget: amount,
      budgetAgreed: false,
      budgetApprovals: { seerin: true, alex: false, john: false, emma: false },
      messages: [...s.messages, msg({ author: 'seerin', kind: 'text', text: `Let's try $${amount} instead.` })],
    })
  },

  // Demo: teammates' votes are simulated so one person can walk the full flow.
  startVote: (productId) => {
    const s = get()
    set({
      phase: s.phase === 'budget' || s.phase === 'products' ? 'voting' : s.phase,
      activeVoteId: productId,
      declineStage: 'none',
      votes: s.votes[productId]
        ? s.votes
        : { ...s.votes, [productId]: { seerin: 'pending', alex: 'approve', emma: 'approve', john: 'pending' } },
    })
  },

  castVote: (productId, memberId, v) => {
    const s = get()
    const round = { ...(s.votes[productId] ?? {}), [memberId]: v }
    const votes = { ...s.votes, [productId]: round }
    const p = productById(productId)
    if (v === 'decline') {
      set({
        votes,
        declineStage: 'asking',
        declineMember: memberId,
        messages: [...s.messages, msg({ author: 'ai', kind: 'ai', text: `${members.find((m) => m.id === memberId)!.name}, what concerns you about this option?` })],
      })
      return
    }
    const allIn = members.every((m) => round[m.id] === 'approve')
    if (allIn) {
      set({
        votes, selectedId: productId, phase: 'funding',
        messages: [...s.messages, msg({ author: 'system', kind: 'event', text: `Everyone's on board — ${p.name} finalized` })],
      })
    } else set({ votes })
  },

  simulateJohn: (productId) => get().castVote(productId, 'john', productId === 'printer' ? 'approve' : 'decline'),

  answerDecline: (reason) => {
    const s = get()
    const who = members.find((m) => m.id === s.declineMember)!
    const productId = s.activeVoteId!
    set({
      declineStage: 'thinking',
      messages: [...s.messages, msg({ author: s.declineMember ?? 'john', kind: 'text', text: reason === 'Other' ? 'Something else is bothering me about it.' : `${reason}.` })],
    })
    setTimeout(() => {
      const c = get()
      set({
        declineStage: 'done',
        rejected: [...c.rejected, productId],
        pendingRejectTransition: true,
        constraints: [...c.constraints, `${who.name}: ${reason}`],
        phase: 'products',
        messages: [...c.messages, msg({ author: 'ai', kind: 'ai', text: "Thanks. I've updated the group's constraints and will adjust the recommendations." })],
      })
    }, 1900)
  },

  clearRejectTransition: () => set({ pendingRejectTransition: false }),

  contribute: (memberId, amount) => {
    const s = get()
    const target = s.fundingTarget ?? totals(productById(s.selectedId ?? 'printer')).total
    const paid = Object.values(s.contributions).reduce((a, b) => a + b, 0)
    const add = Math.min(amount, Math.max(target - paid, 0))
    if (add <= 0) return
    const contributions = { ...s.contributions, [memberId]: (s.contributions[memberId] ?? 0) + add }
    const done = paid + add >= target
    const name = members.find((m) => m.id === memberId)!.name
    const out = [...s.messages, msg({ author: 'system', kind: 'event', text: `${name} contributed $${add}` })]
    if (done) out.push(msg({ author: 'ai', kind: 'ai', text: 'Funding is complete. The admin can now start the purchase.' }))
    set({
      contributions,
      contributionOrder: [...s.contributionOrder.filter((m) => m !== memberId), memberId],
      lastContribution: { memberId, amount: add, nonce: Date.now() },
      phase: done ? 'purchase' : s.phase,
      messages: out,
    })
  },

  setPriceChangeDemo: (v) => set({ priceChangeDemo: v }),
  beginPurchase: () => set({ purchase: 'running' }),
  flagPriceChange: () => set({ purchase: 'price-changed' }),

  finishPurchase: () => {
    const s = get()
    set({
      purchase: 'done',
      phase: 'done',
      messages: [
        ...s.messages,
        msg({ author: 'system', kind: 'event', text: 'Purchase complete — order #PC-A84D92' }),
        msg({ author: 'ai', kind: 'ai', text: 'Portable Photo Printer is on its way. Estimated delivery: Oct 22.' }),
      ],
    })
  },

  requestExtraFunding: () => {
    const s = get()
    set({
      purchase: 'idle', priceChangeDemo: false, fundingTarget: 158, phase: 'funding',
      messages: [...s.messages, msg({ author: 'ai', kind: 'ai', text: 'The price rose to $158. I need $8 more in contributions before I can continue.' })],
    })
  },

  setAi: (open, prompt = null) => set({ aiOpen: open, aiPrompt: open ? prompt : null }),
  reset: () => set(initial()),
}))

/* ---------- selectors / derived values ---------- */
export const selectRequired = (s: State) =>
  s.fundingTarget ?? totals(productById(s.selectedId ?? 'printer')).total
export const selectFunded = (s: State) => Object.values(s.contributions).reduce((a, b) => a + b, 0)

/** Final charged amount per member: later contributors absorb any savings against the authorized total. */
export const computeFinalSplit = (a: { contributions: Record<string, number>; contributionOrder: string[]; selectedId: string | null; fundingTarget: number | null }) => {
  const p = productById(a.selectedId ?? 'printer')
  const authorized = Object.values(a.contributions).reduce((x, y) => x + y, 0)
  const finalTotal = a.fundingTarget ?? p.finalTotal ?? totals(p).total
  let surplus = Math.round((authorized - finalTotal) * 100) / 100
  const split = { ...a.contributions }
  for (const id of [...a.contributionOrder].reverse()) {
    if (surplus <= 0) break
    const take = Math.min(split[id], surplus)
    split[id] = Math.round((split[id] - take) * 100) / 100
    surplus = Math.round((surplus - take) * 100) / 100
  }
  return { split, finalTotal, released: Math.max(Math.round((authorized - finalTotal) * 100) / 100, 0) }
}

/** Hook form: subscribes to stable slices and memoizes the derived object (avoids new-reference selector loops). */
export const useFinalSplit = () => {
  const contributions = useCircleStore((s) => s.contributions)
  const contributionOrder = useCircleStore((s) => s.contributionOrder)
  const selectedId = useCircleStore((s) => s.selectedId)
  const fundingTarget = useCircleStore((s) => s.fundingTarget)
  return useMemo(() => computeFinalSplit({ contributions, contributionOrder, selectedId, fundingTarget }), [contributions, contributionOrder, selectedId, fundingTarget])
}

export const PHASES: { key: Phase | 'preferences'; label: string }[] = [
  { key: 'budget', label: 'Budget' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'products', label: 'Products' },
  { key: 'voting', label: 'Voting' },
  { key: 'funding', label: 'Funding' },
  { key: 'purchase', label: 'Purchase' },
]
const order: Phase[] = ['budget', 'products', 'voting', 'funding', 'purchase', 'done']
/** done | current | todo for each of the six timeline steps. */
export const timelineStates = (phase: Phase): ('done' | 'current' | 'todo')[] => {
  const idx = order.indexOf(phase)
  const map = [0, -1, 1, 2, 3, 4] // index in `order` that each timeline step maps to (-1 = always done)
  return map.map((o) => (o === -1 ? 'done' : idx > o ? 'done' : idx === o ? 'current' : 'todo')) as ('done' | 'current' | 'todo')[]
}
export const phaseLabel = (p: Phase) =>
  ({ budget: 'Agreeing on budget', products: 'Product Discovery', voting: 'Voting', funding: 'Funding', purchase: 'Ready to Purchase', done: 'Purchased' })[p]
