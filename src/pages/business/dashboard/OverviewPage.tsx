import { motion } from 'framer-motion'
import { ArrowRight, DollarSign, ExternalLink, Package, Paintbrush, Percent, Plus, ShoppingBag, TicketPercent, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AreaChart } from '../../../components/charts/AreaChart'
import { Card, ChartCard, StatCard } from '../../../components/business/DashboardUI'
import { Segmented } from '../../../components/shared/Segmented'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { ProductArt } from '../../../components/visuals/ProductArt'
import { useBusiness } from '../../../context/BusinessContext'
import { LOW_STOCK_THRESHOLD } from '../../../data/adminProducts'
import { OVERVIEW_KPIS, RANGE_LABELS, SERIES, summarize, TOP_PRODUCTS } from '../../../data/analytics'
import type { RangeKey } from '../../../data/types'
import { money, moneyShort } from '../../../lib/utils'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function OverviewPage() {
  const navigate = useNavigate()
  const { profile, adminOrders, products } = useBusiness()
  const needRestock = products.filter((p) => p.status !== 'Archived' && p.stock <= LOW_STOCK_THRESHOLD).length
  const [range, setRange] = useState<RangeKey>('30d')
  const series = SERIES[range]
  const summary = summarize(range)
  const spark = SERIES['30d'].slice(-12)
  const k = OVERVIEW_KPIS
  const maxTop = TOP_PRODUCTS[0].revenue

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-muted">{greeting()}, Joud</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg sm:text-[28px]">Store Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Here's what's happening with {profile.storeName} in the last 30 days.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate('/business/products', { state: { add: true } })}
            className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-[13px] font-semibold text-gold-ink shadow-glow"
          >
            <Plus className="size-4" /> Add product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Revenue" value={k.revenue} format={(n) => moneyShort(n)} delta={k.deltas.revenue} icon={<DollarSign className="size-4" />} spark={spark.map((p) => p.revenue)} delay={0} />
        <StatCard label="Orders" value={k.orders} delta={k.deltas.orders} icon={<ShoppingBag className="size-4" />} spark={spark.map((p) => p.orders)} sparkColor="#60A5FA" delay={0.05} />
        <StatCard label="Products" value={k.products} delta={k.deltas.products} deltaSuffix=" new" hint="12 styles · all variants" icon={<Package className="size-4" />} delay={0.1} />
        <StatCard label="Customers" value={k.customers} delta={k.deltas.customers} icon={<Users className="size-4" />} spark={spark.map((p) => p.customers)} sparkColor="#34D399" delay={0.15} />
        <StatCard
          label="Conversion"
          value={k.conversion}
          format={(n) => `${n.toFixed(1)}%`}
          delta={k.deltas.conversion}
          deltaSuffix=" pts"
          icon={<Percent className="size-4" />}
          spark={spark.map((p) => p.conversion)}
          sparkColor="#A78BFA"
          delay={0.2}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <ChartCard
          title="Revenue"
          subtitle={
            <span>
              <span className="text-xl font-bold text-fg">{money(summary.revenue, 0)}</span>
              <span className="ml-2 text-xs">{RANGE_LABELS[range]}</span>
            </span>
          }
          actions={
            <Segmented
              size="sm"
              value={range}
              onChange={setRange}
              options={[
                { value: '7d', label: '7 days' },
                { value: '30d', label: '30 days' },
                { value: '12m', label: '12 months' },
              ]}
            />
          }
          delay={0.1}
        >
          <AreaChart
            data={series.map((p) => ({ label: p.label, value: p.revenue }))}
            format={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`)}
            animationKey={range}
            height={280}
          />
        </ChartCard>

        <ChartCard
          title="Top products"
          subtitle="By revenue · all time"
          actions={
            <button onClick={() => navigate('/business/analytics')} className="text-xs font-semibold text-gold hover:underline">
              Analytics
            </button>
          }
          delay={0.15}
        >
          <ul className="space-y-4">
            {TOP_PRODUCTS.slice(0, 4).map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <ProductArt kind={p.kind} color={p.color} className="size-12 shrink-0" rounded="rounded-xl" scale={0.75} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="truncate font-medium text-fg">{p.name}</span>
                    <span className="font-semibold text-fg">{moneyShort(p.revenue)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      className="h-full rounded-full gold-gradient"
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.revenue / maxTop) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-dim">{p.units} sold</div>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <Card className="overflow-hidden" delay={0.2}>
          <div className="flex items-center justify-between px-6 pb-3 pt-5">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Recent orders</h2>
              <p className="mt-0.5 text-sm text-muted">Cash on delivery · live from the customer app</p>
            </div>
            <button onClick={() => navigate('/business/orders')} className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
              View all <ArrowRight className="size-3.5" />
            </button>
          </div>
          <ul>
            {adminOrders.slice(0, 5).map((o, i) => (
              <motion.li
                key={o.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <button
                  onClick={() => navigate('/business/orders', { state: { open: o.id } })}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-3 border-t border-line/60 px-6 py-3.5 text-left text-sm transition-colors hover:bg-surface-2/50 sm:grid-cols-[110px_1fr_90px_140px]"
                >
                  <span className="flex items-center gap-2 font-semibold text-fg">
                    {o.id}
                    {o.live && <span className="rounded bg-gold/15 px-1.5 py-px text-[9.5px] font-bold uppercase text-gold">Live</span>}
                  </span>
                  <span className="hidden truncate text-muted sm:block">
                    {o.customer} · {o.product}
                  </span>
                  <span className="hidden font-semibold text-fg sm:block">{money(o.total, 0)}</span>
                  <span className="justify-self-end">
                    <StatusBadge status={o.status} />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card className="p-6" delay={0.25}>
          <h2 className="text-[15px] font-semibold text-fg">Quick actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Add product', icon: Plus, onClick: () => navigate('/business/products', { state: { add: true } }) },
              { label: 'Create offer', icon: TicketPercent, onClick: () => navigate('/business/offers', { state: { add: true } }) },
              { label: 'Customize store', icon: Paintbrush, onClick: () => navigate('/business/builder') },
              { label: 'Invite staff', icon: Users, onClick: () => navigate('/business/staff', { state: { add: true } }) },
            ].map((a) => (
              <motion.button
                key={a.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={a.onClick}
                className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface-2/50 p-4 text-left text-[13px] font-semibold text-fg transition-colors hover:border-gold/40"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-gold/10 text-gold">
                  <a.icon className="size-4" />
                </span>
                {a.label}
              </motion.button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-line bg-bg-2/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-fg">Store health</span>
              <span className="text-gold">92 / 100</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <motion.div className="h-full rounded-full gold-gradient" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ delay: 0.5, duration: 1 }} />
            </div>
            <button onClick={() => navigate('/business/inventory')} className="mt-3 flex items-center gap-1 text-xs text-muted hover:text-gold">
              <ExternalLink className="size-3" /> {needRestock} products need restocking
            </button>
          </div>
        </Card>
      </div>
    </>
  )
}
