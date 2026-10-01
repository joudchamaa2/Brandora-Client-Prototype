import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, List, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Card, Field, inputClass, PageHeader, TabFilter, Table } from '../../../components/business/DashboardUI'
import { Button } from '../../../components/shared/Button'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Modal } from '../../../components/shared/Modal'
import { Segmented } from '../../../components/shared/Segmented'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { ProductArt } from '../../../components/visuals/ProductArt'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import { PRODUCT_CATEGORIES, stockState } from '../../../data/adminProducts'
import type { ProductKind, ProductStatus } from '../../../data/types'
import { useRouteIntent } from '../../../lib/useRouteIntent'
import { cn, money } from '../../../lib/utils'

type StatusFilter = 'All' | ProductStatus

const KINDS: { kind: ProductKind; label: string }[] = [
  { kind: 'jacket', label: 'Jacket' },
  { kind: 'hoodie', label: 'Hoodie' },
  { kind: 'tee', label: 'T-shirt' },
  { kind: 'shirt', label: 'Shirt' },
  { kind: 'pants', label: 'Pants' },
  { kind: 'dress', label: 'Dress' },
]
const COLORS = ['#23262f', '#5d6b3a', '#c9b28a', '#2b3a67', '#7a2e3b', '#f1f1ee']

const stockColor = (stock: number) => {
  const s = stockState(stock)
  return s === 'Out of stock' ? 'text-danger' : s === 'Low stock' ? 'text-warn' : 'text-fg'
}

function AddProductModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProduct } = useBusiness()
  const { toast } = useToast()
  const empty = { name: '', category: 'Outerwear', price: '', stock: '', status: 'Active' as ProductStatus, kind: 'jacket' as ProductKind, color: COLORS[0] }
  const [form, setForm] = useState(empty)
  const valid = form.name.trim() && Number(form.price) > 0 && form.stock !== '' && Number(form.stock) >= 0

  const submit = () => {
    addProduct({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
      kind: form.kind,
      color: form.color,
    })
    toast({ title: 'Product added', description: `${form.name.trim()} is now in your catalog${form.status === 'Active' ? ' and storefront' : ''}.` })
    setForm(empty)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add product"
      description="Create a new product for your store."
      width="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit}>
            Save product
          </Button>
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
        <div>
          <ProductArt kind={form.kind} color={form.color} className="aspect-square w-full" rounded="rounded-2xl" scale={0.7} />
          <div className="mt-3 text-xs font-medium text-muted">Color</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={cn('size-7 rounded-full ring-2 ring-offset-2 ring-offset-surface', form.color === c ? 'ring-gold' : 'ring-transparent')}
                style={{ background: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Product name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Varsity Jacket" className={inputClass} autoFocus />
          </Field>
          <Field label="Product type">
            <div className="grid grid-cols-3 gap-2">
              {KINDS.map((k) => (
                <button
                  key={k.kind}
                  onClick={() => setForm({ ...form, kind: k.kind })}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
                    form.kind === k.kind ? 'border-gold bg-gold/10 text-gold' : 'border-line text-muted hover:text-fg',
                  )}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (USD)">
              <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className={inputClass} />
            </Field>
            <Field label="Stock">
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <Segmented
                className="flex w-full"
                size="sm"
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v })}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Draft', label: 'Draft' },
                ]}
              />
            </Field>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function ProductsAdminPage() {
  const intent = useRouteIntent<{ q: string; add: boolean }>()
  const { products } = useBusiness()
  const [query, setQuery] = useState(intent.q ?? '')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [category, setCategory] = useState('All')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [adding, setAdding] = useState(!!intent.add)

  useEffect(() => {
    if (intent.q !== undefined) setQuery(intent.q)
    if (intent.add) setAdding(true)
  }, [intent])

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (status === 'All' || p.status === status) &&
          (category === 'All' || p.category === category) &&
          (!query.trim() || `${p.name} ${p.sku}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [products, status, category, query],
  )

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} styles · 128 variants across sizes and colors`}
        actions={
          <Button icon={<Plus className="size-4" />} onClick={() => setAdding(true)}>
            Add product
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 xl:flex-row xl:items-center xl:justify-between">
          <TabFilter<StatusFilter>
            value={status}
            onChange={setStatus}
            tabs={(['All', 'Active', 'Draft', 'Archived'] as StatusFilter[]).map((s) => ({
              value: s,
              label: s,
              count: s === 'All' ? products.length : products.filter((p) => p.status === s).length,
            }))}
          />
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-60 sm:flex-none">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className={cn(inputClass, 'h-10 pl-9')} />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, 'h-10 w-auto')} aria-label="Category">
              <option value="All">All categories</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div className="flex rounded-xl border border-line p-0.5">
              {(['table', 'grid'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-label={`${v} view`}
                  className={cn('grid size-9 place-items-center rounded-lg transition-colors', view === v ? 'bg-surface-3 text-gold' : 'text-dim hover:text-fg')}
                >
                  {v === 'table' ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<Search className="size-7" />} title="No products match" description="Adjust the filters or add a new product." />
        ) : view === 'table' ? (
          <Table
            head={
              <>
                <th>Product</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th className="text-right">Sales</th>
              </>
            }
          >
            <AnimatePresence initial={false}>
              {list.map((p) => (
                <motion.tr
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  exit={{ opacity: 0 }}
                  className="transition-colors hover:bg-surface-2/50"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <ProductArt kind={p.kind} color={p.color} className="size-11 shrink-0" rounded="rounded-xl" scale={0.75} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-fg">{p.name}</div>
                        <div className="text-xs text-dim">
                          {p.sku} · {p.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-fg">{money(p.price, 0)}</td>
                  <td>
                    <span className={cn('font-medium', stockColor(p.stock))}>{p.stock} in stock</span>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="text-right text-muted">{p.sales}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence initial={false}>
              {list.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-line bg-bg-2/50 p-3"
                >
                  <ProductArt kind={p.kind} color={p.color} className="aspect-[4/3] w-full" rounded="rounded-xl" scale={0.6} />
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-fg">{p.name}</div>
                      <div className={cn('text-xs', stockColor(p.stock))}>{p.stock} in stock</div>
                    </div>
                    <span className="text-sm font-bold text-gold">{money(p.price, 0)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    <span className="text-[11px] text-dim">{p.sales} sold</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Card>

      <AddProductModal open={adding} onClose={() => setAdding(false)} />
    </>
  )
}
