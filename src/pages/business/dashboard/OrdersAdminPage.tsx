import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Check, Download, Mail, MapPin, Phone, Search, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Card, inputClass, PageHeader, TabFilter, Table } from '../../../components/business/DashboardUI'
import { Button } from '../../../components/shared/Button'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Drawer } from '../../../components/shared/Modal'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import { ORDER_STATUSES } from '../../../data/adminOrders'
import type { AdminOrder, AdminOrderStatus } from '../../../data/types'
import { useRouteIntent } from '../../../lib/useRouteIntent'
import { cn, money } from '../../../lib/utils'

type Filter = 'All' | AdminOrderStatus

const NEXT_ACTION: Partial<Record<AdminOrderStatus, { label: string; next: AdminOrderStatus }>> = {
  Pending: { label: 'Accept order', next: 'Accepted' },
  Accepted: { label: 'Start processing', next: 'Processing' },
  Processing: { label: 'Hand to driver', next: 'Out for delivery' },
  'Out for delivery': { label: 'Mark as delivered', next: 'Delivered' },
}

function exportCsv(orders: AdminOrder[]) {
  const head = ['Order', 'Customer', 'Product', 'Items', 'Total', 'Payment', 'Status', 'Date']
  const rows = orders.map((o) => [o.id, o.customer, o.product, o.items, o.total, o.payment, o.status, o.date])
  const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'brandora-orders.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function OrdersAdminPage() {
  const intent = useRouteIntent<{ q: string; open: string }>()
  const { adminOrders, setOrderStatus } = useBusiness()
  const { toast } = useToast()
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState(intent.q ?? '')
  const [openId, setOpenId] = useState<string | null>(intent.open ?? null)

  useEffect(() => {
    if (intent.q !== undefined) setQuery(intent.q)
    if (intent.open) setOpenId(intent.open)
  }, [intent])

  const list = useMemo(
    () =>
      adminOrders.filter(
        (o) =>
          (filter === 'All' || o.status === filter) &&
          (!query.trim() || `${o.id} ${o.customer} ${o.product}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [adminOrders, filter, query],
  )
  const open = adminOrders.find((o) => o.id === openId) ?? null
  const counts = (s: Filter) => (s === 'All' ? adminOrders.length : adminOrders.filter((o) => o.status === s).length)

  const advance = (o: AdminOrder) => {
    const action = NEXT_ACTION[o.status]
    if (!action) return
    setOrderStatus(o.id, action.next)
    toast({ title: `${o.id} · ${action.next}`, description: `${o.customer} will be notified in the app.` })
  }

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage and fulfil orders. All customer orders are paid cash on delivery."
        actions={
          <Button
            variant="secondary"
            icon={<Download className="size-4" />}
            onClick={() => {
              exportCsv(list)
              toast({ title: 'Export ready', description: `${list.length} orders exported to CSV` })
            }}
          >
            Export CSV
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <TabFilter<Filter>
            value={filter}
            onChange={setFilter}
            tabs={(['All', ...ORDER_STATUSES] as Filter[]).map((s) => ({ value: s, label: s, count: counts(s) }))}
          />
          <div className="relative lg:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order or customer" className={cn(inputClass, 'h-10 pl-9')} />
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<Search className="size-7" />} title="No orders found" description="Try a different status or search term." />
        ) : (
          <Table
            head={
              <>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </>
            }
          >
            <AnimatePresence initial={false}>
              {list.map((o, i) => (
                <motion.tr
                  key={o.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: Math.min(i, 10) * 0.03 } }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpenId(o.id)}
                  className="cursor-pointer transition-colors hover:bg-surface-2/50"
                >
                  <td>
                    <span className="flex items-center gap-2 font-semibold text-fg">
                      {o.id}
                      {o.live && <span className="rounded bg-gold/15 px-1.5 py-px text-[9.5px] font-bold uppercase text-gold">Live</span>}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-full bg-surface-3 text-[10px] font-bold text-muted">
                        {o.customer.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </span>
                      <span className="text-fg">{o.customer}</span>
                    </div>
                  </td>
                  <td className="max-w-[220px] truncate text-muted">{o.product}</td>
                  <td className="font-semibold text-fg">{money(o.total)}</td>
                  <td className="text-muted">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="size-3.5 text-gold" /> COD
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="whitespace-nowrap text-muted">{o.date}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table>
        )}
      </Card>

      <Drawer
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open ? `Order ${open.id}` : ''}
        description={open ? `${open.date} · ${open.payment}` : ''}
        footer={
          open &&
          (NEXT_ACTION[open.status] ? (
            <Button block onClick={() => advance(open)} icon={<Check className="size-4" />}>
              {NEXT_ACTION[open.status]!.label}
            </Button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-success/10 py-3 text-sm font-semibold text-success">
              <Check className="size-4" /> Order completed
            </div>
          ))
        }
      >
        {open && (
          <div className="space-y-6">
            {/* status stepper */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-fg">Status</span>
                <StatusBadge status={open.status} />
              </div>
              <div className="flex gap-1.5">
                {ORDER_STATUSES.map((s, i) => {
                  const reached = ORDER_STATUSES.indexOf(open.status) >= i
                  return (
                    <div key={s} className="flex-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                        <motion.div className="h-full gold-gradient" initial={false} animate={{ width: reached ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                      </div>
                      <div className={cn('mt-1.5 text-[10px] leading-tight', reached ? 'text-fg' : 'text-dim')}>{s}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <section className="rounded-2xl border border-line p-4">
              <div className="mb-3 text-sm font-semibold text-fg">Customer</div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-fg">
                  <User className="size-4 text-dim" /> {open.customer}
                </div>
                <div className="flex items-center gap-2.5 text-muted">
                  <Mail className="size-4 text-dim" /> {open.email}
                </div>
                <div className="flex items-center gap-2.5 text-muted">
                  <Phone className="size-4 text-dim" /> {open.phone}
                </div>
                <div className="flex items-center gap-2.5 text-muted">
                  <MapPin className="size-4 text-dim" /> {open.address}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line p-4">
              <div className="mb-3 text-sm font-semibold text-fg">Items</div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">
                  {open.product} <span className="text-dim">× {open.items}</span>
                </span>
              </div>
              <div className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{money(open.total - 3)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Delivery</span>
                  <span>{money(3)}</span>
                </div>
                <div className="flex justify-between font-semibold text-fg">
                  <span>Total</span>
                  <span className="text-gold">{money(open.total)}</span>
                </div>
              </div>
            </section>

            <section className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-gold/8 p-4 text-sm">
              <Banknote className="size-5 text-gold" />
              <div>
                <div className="font-semibold text-fg">Cash on delivery</div>
                <div className="text-xs text-muted">Collect {money(open.total)} from the customer on delivery</div>
              </div>
            </section>
          </div>
        )}
      </Drawer>
    </>
  )
}
