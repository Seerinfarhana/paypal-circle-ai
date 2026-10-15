import { members, productById, products, totals } from '@/data/mock'
import { selectFunded, selectRequired, type useCircleStore } from '@/store/circleStore'

type S = ReturnType<typeof useCircleStore.getState>
export interface Answer { title: string; text: string; rows: { label: string; value: string; tone?: 'ok' | 'wait' | 'bad' }[] }

export const QUICK_PROMPTS = [
  'What are we waiting for?', 'Who hasn\'t voted?', 'How much more funding do we need?',
  'Find cheaper alternatives.', 'Why was this product recommended?', "Show John's preferences.",
]

/** Context-aware answers built from live Circle state. Swap for a real model call later. */
export function getAnswer(q: string, s: S): Answer {
  const t = q.toLowerCase()
  const funded = selectFunded(s)
  const required = selectRequired(s)

  if (t.includes('voted') || t.includes('vote')) {
    const round = s.activeVoteId ? s.votes[s.activeVoteId] : null
    if (!round) return { title: 'No vote open', text: 'Nobody has a vote to cast yet. Choose a product to start one.', rows: [] }
    return { title: 'Votes so far', text: `${productById(s.activeVoteId!).name}`, rows: members.map((m) => ({ label: m.name, value: round[m.id] === 'approve' ? 'Approved' : round[m.id] === 'decline' ? 'Declined' : 'Pending', tone: round[m.id] === 'approve' ? 'ok' : round[m.id] === 'decline' ? 'bad' : 'wait' })) }
  }
  if (t.includes('funding') || t.includes('much')) {
    return { title: 'Funding', text: funded >= required ? 'Funding is complete.' : `${'$' + (required - funded)} more is needed.`, rows: [{ label: 'Funded', value: `$${funded}`, tone: 'ok' }, { label: 'Required', value: `$${required}` }, { label: 'Remaining', value: `$${Math.max(required - funded, 0)}`, tone: funded >= required ? 'ok' : 'wait' }] }
  }
  if (t.includes('cheaper')) {
    const base = s.selectedId ? productById(s.selectedId) : productById('printer')
    const cheaper = products.filter((p) => p.price < base.price && !s.rejected.includes(p.id) && (!p.late || s.rejected.length)).sort((a, b) => b.match - a.match)
    return { title: 'Cheaper alternatives', text: cheaper.length ? `Options under $${base.price}, best match first.` : 'Nothing cheaper fits the group yet.', rows: cheaper.map((p) => ({ label: p.name, value: `$${p.price} · ${p.match}% match` })) }
  }
  if (t.includes('why') || t.includes('recommend')) {
    const p = productById(s.selectedId ?? (s.rejected.includes('camera') ? 'printer' : 'camera'))
    return { title: `Why ${p.name}`, text: p.explanation, rows: p.reasons.map((r) => ({ label: r, value: '✓', tone: 'ok' as const })) }
  }
  if (t.includes('john')) {
    return { title: "John's preferences", text: 'Based on what John has said in chat.', rows: [{ label: 'Avoids', value: 'Perfume' }, { label: 'Wants', value: 'Useful gifts' }, { label: 'Budget idea', value: '$350' }, ...s.constraints.filter((c) => c.startsWith('John')).map((c) => ({ label: 'Concern', value: c.replace('John: ', '') }))] }
  }
  // default: what are we waiting for
  const waiting: Answer['rows'] = []
  if (s.phase === 'budget') waiting.push({ label: 'Budget approval', value: `${Object.values(s.budgetApprovals).filter(Boolean).length} of ${members.length}`, tone: 'wait' })
  if (s.phase === 'products') waiting.push({ label: 'A product to vote on', value: 'Open', tone: 'wait' })
  if (s.phase === 'voting') waiting.push({ label: 'Votes', value: 'In progress', tone: 'wait' })
  if (s.phase === 'funding') waiting.push({ label: 'Funding', value: `$${required - funded} to go`, tone: 'wait' })
  if (s.phase === 'purchase') waiting.push({ label: 'Admin to start purchase', value: 'Ready', tone: 'ok' })
  if (s.phase === 'done') waiting.push({ label: 'Delivery', value: 'Oct 22', tone: 'ok' })
  return { title: 'Waiting on', text: s.phase === 'done' ? 'Nothing. The purchase is complete.' : 'Here is what is holding the Circle up right now.', rows: waiting }
}

export const totalFor = (id: string) => totals(productById(id)).total
