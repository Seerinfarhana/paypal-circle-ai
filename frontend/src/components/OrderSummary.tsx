import { members, productById } from '@/data/mock'
import { useCircleStore, useFinalSplit } from '@/store/circleStore'
import { usd } from '@/lib/utils'

export function OrderSummary() {
  const selectedId = useCircleStore((s) => s.selectedId)
  const { split, finalTotal, released } = useFinalSplit()
  const p = productById(selectedId ?? 'printer')
  const rows: [string, string][] = [['Product', p.name], ['Total', usd(finalTotal)], ['Order', '#PC-A84D92'], ['Purchased', 'Today'], ['Estimated delivery', 'Oct 22']]
  return (
    <div className="space-y-5">
      <dl className="divide-y divide-slate-100 text-sm">
        {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}
      </dl>
      <div>
        <h3 className="mb-2 font-semibold">Contribution summary</h3>
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 text-sm">
          {members.map((m) => <li key={m.id} className="flex justify-between px-4 py-2.5"><span>{m.name}</span><span className="font-semibold tabular-nums">{usd(split[m.id] ?? 0, 2)}</span></li>)}
        </ul>
        {released > 0 && <p className="mt-2 text-xs text-muted">The final price was {usd(released, 2)} below the funded amount. That amount is released back to the last contributors.</p>}
      </div>
    </div>
  )
}
