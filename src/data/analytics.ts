import type { RangeKey, SeriesPoint } from './types'

/* Deterministic pseudo-random generator so charts look identical on every load */
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** The demo's "today" */
const TODAY = new Date(2026, 9, 2)

function dayLabel(offset: number) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - offset)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

interface Targets {
  revenue: number
  orders: number
  customers: number
}

/** Distributes totals over n points with noise + an upward trend */
function distribute(n: number, targets: Targets, seed: number, trend: number, labels: string[]): SeriesPoint[] {
  const rnd = seeded(seed)
  const weights = Array.from({ length: n }, (_, i) => (0.72 + rnd() * 0.56) * (1 + (trend * i) / n))
  const orderWeights = weights.map((w) => w * (0.85 + rnd() * 0.3))
  const custWeights = weights.map((w) => w * (0.8 + rnd() * 0.4))
  const sum = (a: number[]) => a.reduce((s, v) => s + v, 0)
  const ws = sum(weights)
  const os = sum(orderWeights)
  const cs = sum(custWeights)

  const points = labels.map((label, i) => ({
    label,
    revenue: Math.round((targets.revenue * weights[i]) / ws),
    orders: Math.max(1, Math.round((targets.orders * orderWeights[i]) / os)),
    customers: Math.max(1, Math.round((targets.customers * custWeights[i]) / cs)),
    conversion: Math.round((2.7 + rnd() * 1.4 + (trend * i) / n) * 10) / 10,
  }))
  return points
}

const LABELS_30 = Array.from({ length: 30 }, (_, i) => dayLabel(29 - i))
const LABELS_90 = Array.from({ length: 13 }, (_, i) => `W${i + 1}`).map((_, i) => dayLabel((12 - i) * 7))
const LABELS_12M = Array.from({ length: 12 }, (_, i) => MONTHS[(TODAY.getMonth() - 11 + i + 12) % 12])

const SERIES_30 = distribute(30, { revenue: 4280, orders: 62, customers: 88 }, 42, 0.35, LABELS_30)

export const SERIES: Record<RangeKey, SeriesPoint[]> = {
  '7d': SERIES_30.slice(-7),
  '30d': SERIES_30,
  '90d': distribute(13, { revenue: 11940, orders: 171, customers: 236 }, 7, 0.45, LABELS_90),
  '12m': distribute(12, { revenue: 48620, orders: 702, customers: 760 }, 99, 0.9, LABELS_12M),
}

export const RANGE_LABELS: Record<RangeKey, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '12m': 'Last 12 months',
}

export function summarize(range: RangeKey) {
  const pts = SERIES[range]
  const revenue = pts.reduce((s, p) => s + p.revenue, 0)
  const orders = pts.reduce((s, p) => s + p.orders, 0)
  const customers = pts.reduce((s, p) => s + p.customers, 0)
  const conversion = Math.round((pts.reduce((s, p) => s + p.conversion, 0) / pts.length) * 10) / 10
  return { revenue, orders, customers, conversion, aov: orders ? revenue / orders : 0 }
}

/** Headline KPIs shown on the overview (last 30 days) */
export const OVERVIEW_KPIS = {
  revenue: 4280,
  orders: 62,
  products: 128,
  customers: 843,
  conversion: 3.4,
  deltas: { revenue: 12.4, orders: 8.1, products: 4, customers: 6.3, conversion: 0.4 },
}

export const TOP_PRODUCTS = [
  { name: 'Oversized Bomber Jacket', kind: 'jacket' as const, color: '#23262f', revenue: 4280, units: 48 },
  { name: 'Cargo Utility Pants', kind: 'pants' as const, color: '#5d6b3a', revenue: 2940, units: 46 },
  { name: 'Graphic Tee', kind: 'tee' as const, color: '#f1f1ee', revenue: 1850, units: 64 },
  { name: 'Heavyweight Hoodie', kind: 'hoodie' as const, color: '#3c4150', revenue: 1512, units: 21 },
  { name: 'Denim Trucker Jacket', kind: 'jacket' as const, color: '#2b3a67', revenue: 1140, units: 12 },
]

export const SALES_BY_CATEGORY = [
  { label: 'Outerwear', value: 38, color: '#E8B948' },
  { label: 'Bottoms', value: 24, color: '#60A5FA' },
  { label: 'Tees', value: 20, color: '#34D399' },
  { label: 'Hoodies', value: 12, color: '#A78BFA' },
  { label: 'Accessories', value: 6, color: '#F472B6' },
]

export const TRAFFIC_SOURCES = [
  { label: 'Brandora marketplace', value: 58 },
  { label: 'Direct storefront', value: 18 },
  { label: 'Instagram', value: 16 },
  { label: 'WhatsApp shares', value: 8 },
]

export const BUSINESS_NOTIFICATIONS = [
  { id: 'n1', title: 'New order BR-34862', body: 'Maya Haddad · $120.00 · Cash on delivery', time: '2 min ago', kind: 'order' as const },
  { id: 'n2', title: 'Low stock alert', body: 'Cargo Utility Pants — only 8 left', time: '1 h ago', kind: 'stock' as const },
  { id: 'n3', title: 'New 5★ review', body: '“Amazing quality, fast delivery!” — Lara N.', time: '3 h ago', kind: 'review' as const },
  { id: 'n4', title: 'Subscription renewed', body: 'Your plan was renewed via Whish Money', time: 'Yesterday', kind: 'billing' as const },
]
