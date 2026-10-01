import { motion } from 'framer-motion'
import { CalendarClock, Check, CreditCard, Receipt, Sparkles, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Card, PageHeader, Table } from '../../../components/business/DashboardUI'
import { PlanCard } from '../../../components/business/PlanCard'
import { Button } from '../../../components/shared/Button'
import { Drawer, Modal } from '../../../components/shared/Modal'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import { PAYMENT_HISTORY, PLANS } from '../../../data/plans'
import type { PlanId } from '../../../data/types'

export function SubscriptionPage() {
  const { plan, planId, setPlanId, products, staff } = useBusiness()
  const { toast } = useToast()
  const [changing, setChanging] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [pending, setPending] = useState<PlanId>(planId)

  const productLimit = planId === 'starter' ? 50 : null
  const staffLimit = planId === 'starter' ? 1 : planId === 'growth' ? 3 : planId === 'premium' ? 10 : null

  const usage = [
    { label: 'Products', used: products.length, limit: productLimit },
    { label: 'Staff seats', used: staff.length, limit: staffLimit },
    { label: 'Storage', used: 2.4, limit: 10, unit: 'GB' },
  ]

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Manage your Brandora plan and billing."
        actions={
          <>
            <Button variant="secondary" icon={<Receipt className="size-4" />} onClick={() => setHistoryOpen(true)}>
              View payment history
            </Button>
            <Button
              icon={<Sparkles className="size-4" />}
              onClick={() => {
                setPending(planId)
                setChanging(true)
              }}
            >
              Change plan
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-dim">Current plan</div>
              <motion.div key={plan.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-fg">{plan.name}</span>
                <span className="text-lg text-gold">${plan.price}/month</span>
              </motion.div>
              <p className="mt-2 text-sm text-muted">{plan.tagline}</p>
            </div>
            <StatusBadge status="Active" className="px-3 py-1.5 text-xs" />
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: CalendarClock, label: 'Billing period', value: 'Monthly' },
              { icon: CreditCard, label: 'Next payment', value: `Nov 2, 2026 · $${plan.price}` },
              { icon: Wallet, label: 'Payment method', value: 'Whish Money' },
            ].map((i) => (
              <div key={i.label} className="rounded-2xl border border-line bg-bg-2/60 p-4">
                <i.icon className="size-4 text-gold" />
                <div className="mt-3 text-xs text-dim">{i.label}</div>
                <div className="mt-0.5 text-sm font-semibold text-fg">{i.value}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-8">
            <div className="text-sm font-semibold text-fg">Plan features</div>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted">
                  <span className="grid size-5 place-items-center rounded-full bg-gold/15">
                    <Check className="size-3 text-gold" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6" delay={0.05}>
            <h2 className="text-[15px] font-semibold text-fg">Usage</h2>
            <ul className="mt-5 space-y-5">
              {usage.map((u, i) => {
                const pct = u.limit ? Math.min(100, (u.used / u.limit) * 100) : 18
                return (
                  <li key={u.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted">{u.label}</span>
                      <span className="font-semibold text-fg">
                        {u.used}
                        {u.unit ? ` ${u.unit}` : ''} / {u.limit ? `${u.limit}${u.unit ? ` ${u.unit}` : ''}` : 'Unlimited'}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                      <motion.div
                        className="h-full rounded-full gold-gradient"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card className="p-6" delay={0.1}>
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-fg">Recent payments</h2>
              <button onClick={() => setHistoryOpen(true)} className="text-xs font-semibold text-gold hover:underline">
                See all
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              {PAYMENT_HISTORY.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-fg">{p.date}</div>
                    <div className="text-xs text-dim">{p.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-fg">${p.amount}.00</div>
                    <div className="text-xs text-success">{p.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        open={changing}
        onClose={() => setChanging(false)}
        title="Change plan"
        description="Your new plan starts immediately. Billing is prorated on the next invoice."
        width="max-w-6xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setChanging(false)}>
              Cancel
            </Button>
            <Button
              disabled={pending === planId}
              onClick={() => {
                setPlanId(pending)
                setChanging(false)
                const next = PLANS.find((p) => p.id === pending)!
                toast({ title: `Switched to ${next.name}`, description: `$${next.price}/month · charged via Whish Money on Nov 2` })
              }}
            >
              Confirm change
            </Button>
          </>
        }
      >
        <div className="grid gap-4 pt-3 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} selected={p.id === pending} current={p.id === planId} onSelect={() => setPending(p.id)} />
          ))}
        </div>
      </Modal>

      <Drawer open={historyOpen} onClose={() => setHistoryOpen(false)} title="Payment history" description="Subscription invoices paid via Whish Money">
        <Table
          className="-mx-6"
          minWidth="min-w-0"
          head={
            <>
              <th>Invoice</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </>
          }
        >
          {PAYMENT_HISTORY.map((p) => (
            <tr key={p.id}>
              <td className="font-medium text-fg">{p.id}</td>
              <td className="text-muted">{p.date}</td>
              <td className="font-semibold text-fg">${p.amount}.00</td>
              <td>
                <StatusBadge status={p.status} />
              </td>
            </tr>
          ))}
        </Table>
      </Drawer>
    </>
  )
}
