import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Minus, PackageX, Plus, RefreshCw, Warehouse } from 'lucide-react'
import { useState } from 'react'
import { Card, PageHeader, StatCard, TabFilter, Table } from '../../../components/business/DashboardUI'
import { Button } from '../../../components/shared/Button'
import { EmptyState } from '../../../components/shared/EmptyState'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { ProductArt } from '../../../components/visuals/ProductArt'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import { stockState } from '../../../data/adminProducts'
import { cn } from '../../../lib/utils'

type Filter = 'All' | 'In stock' | 'Low stock' | 'Out of stock'
const MAX_BAR = 60

export function InventoryPage() {
  const { products, adjustStock } = useBusiness()
  const { toast } = useToast()
  const [filter, setFilter] = useState<Filter>('All')

  const tracked = products.filter((p) => p.status !== 'Archived')
  const count = (s: Filter) => (s === 'All' ? tracked.length : tracked.filter((p) => stockState(p.stock) === s).length)
  const list = tracked.filter((p) => filter === 'All' || stockState(p.stock) === filter)
  const totalUnits = tracked.reduce((s, p) => s + p.stock, 0)
  const alerts = tracked.filter((p) => stockState(p.stock) !== 'In stock')

  const restock = (id: string, name: string) => {
    adjustStock(id, 20)
    toast({ title: 'Restock recorded', description: `+20 units of ${name}` })
  }

  return (
    <>
      <PageHeader title="Inventory" description="Track stock levels across your catalog and restock before you sell out." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="In stock" value={count('In stock')} icon={<CheckCircle2 className="size-4" />} hint="products healthy" delay={0} />
        <StatCard label="Low stock" value={count('Low stock')} icon={<AlertTriangle className="size-4" />} hint="≤ 10 units left" delay={0.05} />
        <StatCard label="Out of stock" value={count('Out of stock')} icon={<PackageX className="size-4" />} hint="not purchasable" delay={0.1} />
        <StatCard label="Units on hand" value={totalUnits} icon={<Warehouse className="size-4" />} hint="across all products" delay={0.15} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden" delay={0.1}>
          <div className="border-b border-line p-4">
            <TabFilter<Filter>
              value={filter}
              onChange={setFilter}
              tabs={(['All', 'In stock', 'Low stock', 'Out of stock'] as Filter[]).map((s) => ({ value: s, label: s, count: count(s) }))}
            />
          </div>
          {list.length === 0 ? (
            <EmptyState icon={<CheckCircle2 className="size-7" />} title="Nothing here" description="No products in this stock state." />
          ) : (
            <Table
              head={
                <>
                  <th>Product</th>
                  <th>SKU</th>
                  <th className="w-[220px]">Stock level</th>
                  <th>Status</th>
                  <th className="text-right">Adjust</th>
                </>
              }
            >
              {list.map((p, i) => {
                const state = stockState(p.stock)
                const color = state === 'Out of stock' ? '#F87171' : state === 'Low stock' ? '#FBBF24' : '#34D399'
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors hover:bg-surface-2/50"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <ProductArt kind={p.kind} color={p.color} className="size-10 shrink-0" rounded="rounded-xl" scale={0.75} />
                        <span className="font-semibold text-fg">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-xs text-muted">{p.sku}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: color }}
                            initial={false}
                            animate={{ width: `${Math.min(100, (p.stock / MAX_BAR) * 100)}%` }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                        <motion.span key={p.stock} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-8 text-right font-semibold tabular-nums text-fg">
                          {p.stock}
                        </motion.span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={state} />
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          disabled={p.stock === 0}
                          aria-label="Remove one"
                          className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-fg disabled:opacity-30"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, 1)}
                          aria-label="Add one"
                          className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-fg"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </Table>
          )}
        </Card>

        <Card className="h-fit p-5" delay={0.15}>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-fg">
            <AlertTriangle className="size-4 text-warn" /> Restock alerts
          </h2>
          <p className="mt-1 text-sm text-muted">Products that need attention</p>
          <ul className="mt-4 space-y-3">
            {alerts.length === 0 && <li className="text-sm text-success">All products are well stocked 🎉</li>}
            {alerts.map((p) => (
              <motion.li key={p.id} layout className="flex items-center gap-3 rounded-2xl border border-line p-3">
                <ProductArt kind={p.kind} color={p.color} className="size-10 shrink-0" rounded="rounded-lg" scale={0.75} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-fg">{p.name}</div>
                  <div className={cn('text-xs', p.stock === 0 ? 'text-danger' : 'text-warn')}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </div>
                </div>
                <Button size="sm" variant="outline" icon={<RefreshCw className="size-3.5" />} onClick={() => restock(p.id, p.name)}>
                  +20
                </Button>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
