import { motion } from 'framer-motion'
import { DollarSign, Percent, Receipt, ShoppingBag, Users } from 'lucide-react'
import { useState } from 'react'
import { AreaChart } from '../../../components/charts/AreaChart'
import { BarChart } from '../../../components/charts/BarChart'
import { DonutChart } from '../../../components/charts/DonutChart'
import { ChartCard, PageHeader, StatCard } from '../../../components/business/DashboardUI'
import { Segmented } from '../../../components/shared/Segmented'
import { ProductArt } from '../../../components/visuals/ProductArt'
import { RANGE_LABELS, SALES_BY_CATEGORY, SERIES, summarize, TOP_PRODUCTS, TRAFFIC_SOURCES } from '../../../data/analytics'
import type { RangeKey } from '../../../data/types'
import { money, moneyShort } from '../../../lib/utils'

const usd = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`)

export function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>('30d')
  const series = SERIES[range]
  const s = summarize(range)
  // Deterministic "previous period" deltas per range
  const deltas = { '7d': [9.2, 6.4, 5.1, 0.3, 2.6], '30d': [12.4, 8.1, 6.3, 0.4, 4.0], '90d': [18.7, 14.2, 11.8, 0.6, 3.9], '12m': [42.1, 35.6, 39.4, 0.9, 4.8] }[range]

  return (
    <>
      <PageHeader
        title="Analytics"
        description={`Performance overview · ${RANGE_LABELS[range]}`}
        actions={
          <Segmented
            tone="gold"
            value={range}
            onChange={setRange}
            options={[
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' },
              { value: '12m', label: '12 months' },
            ]}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Revenue" value={s.revenue} format={moneyShort} delta={deltas[0]} icon={<DollarSign className="size-4" />} spark={series.map((p) => p.revenue)} />
        <StatCard label="Orders" value={s.orders} delta={deltas[1]} icon={<ShoppingBag className="size-4" />} spark={series.map((p) => p.orders)} sparkColor="#60A5FA" delay={0.05} />
        <StatCard label="New customers" value={s.customers} delta={deltas[2]} icon={<Users className="size-4" />} spark={series.map((p) => p.customers)} sparkColor="#34D399" delay={0.1} />
        <StatCard label="Conversion rate" value={s.conversion} format={(n) => `${n.toFixed(1)}%`} delta={deltas[3]} deltaSuffix=" pts" icon={<Percent className="size-4" />} spark={series.map((p) => p.conversion)} sparkColor="#A78BFA" delay={0.15} />
        <StatCard label="Avg. order value" value={s.aov} format={(n) => money(n)} delta={deltas[4]} icon={<Receipt className="size-4" />} delay={0.2} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <ChartCard title="Revenue" subtitle={<span className="text-xl font-bold text-fg">{money(s.revenue, 0)}</span>} delay={0.1}>
          <AreaChart data={series.map((p) => ({ label: p.label, value: p.revenue }))} format={usd} animationKey={range} height={290} />
        </ChartCard>
        <ChartCard title="Sales by category" subtitle="Share of revenue" delay={0.15}>
          <DonutChart data={SALES_BY_CATEGORY} size={170} />
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Orders" subtitle={`${s.orders} orders · ${RANGE_LABELS[range].toLowerCase()}`} delay={0.15}>
          <BarChart data={series.map((p) => ({ label: p.label, value: p.orders }))} animationKey={range} color="#60A5FA" />
        </ChartCard>
        <ChartCard title="New customers" subtitle={`${s.customers} customers acquired`} delay={0.2}>
          <BarChart data={series.map((p) => ({ label: p.label, value: p.customers }))} animationKey={range} color="#34D399" />
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr_1fr]">
        <ChartCard title="Conversion rate" subtitle={`${s.conversion}% average`} delay={0.2}>
          <AreaChart data={series.map((p) => ({ label: p.label, value: p.conversion }))} format={(v) => `${v.toFixed(1)}%`} color="#A78BFA" animationKey={range} height={220} lineOnly />
        </ChartCard>

        <ChartCard title="Top products" subtitle="By revenue" delay={0.25}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-dim">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 text-right font-semibold">Units</th>
                <th className="pb-3 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => (
                <motion.tr
                  key={p.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="border-t border-line/60"
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 text-xs font-bold text-dim">{i + 1}</span>
                      <ProductArt kind={p.kind} color={p.color} className="size-9 shrink-0" rounded="rounded-lg" scale={0.75} />
                      <span className="truncate font-medium text-fg">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-muted">{p.units}</td>
                  <td className="py-2.5 text-right font-semibold text-fg">{moneyShort(p.revenue)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <ChartCard title="Traffic sources" subtitle="Where customers find you" delay={0.3}>
          <ul className="space-y-4">
            {TRAFFIC_SOURCES.map((t, i) => (
              <li key={t.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted">{t.label}</span>
                  <span className="font-semibold text-fg">{t.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <motion.div
                    className="h-full rounded-full gold-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${t.value}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </>
  )
}
