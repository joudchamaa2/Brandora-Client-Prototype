import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import { orderStage } from '../../context/CustomerContext'
import { TRACKING_STEPS } from '../../data/orders'
import { getStore } from '../../data/stores'
import type { Order } from '../../data/types'
import { money } from '../../lib/utils'
import { listItem } from '../shared/PageTransition'
import { StoreLogo } from '../visuals/StoreVisual'

export function OrderCard({ order, now }: { order: Order; now: number }) {
  const navigate = useNavigate()
  const store = getStore(order.storeId)!
  const stage = orderStage(order, now)
  const delivered = stage === 4
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0)

  return (
    <motion.button
      layout
      variants={listItem}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/customer/order/${order.id}`)}
      className="card-surface w-full rounded-[20px] p-4 text-left transition-colors hover:border-line-strong"
    >
      <div className="flex items-center gap-3">
        <StoreLogo store={store} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-semibold text-fg">{order.id}</span>
            <span className={delivered ? 'text-xs font-semibold text-gold' : 'text-xs font-semibold text-info'}>
              {TRACKING_STEPS[stage].label === 'Order accepted' ? 'Accepted' : TRACKING_STEPS[stage].label}
            </span>
          </div>
          <div className="mt-0.5 truncate text-[13px] text-muted">
            {store.name} · {money(order.total)}
          </div>
        </div>
        <ChevronRight className="size-4 shrink-0 text-dim" />
      </div>
      <div className="mt-3.5 flex items-center gap-1">
        {TRACKING_STEPS.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              className="h-full gold-gradient"
              initial={{ width: 0 }}
              animate={{ width: i <= stage ? '100%' : '0%' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-dim">
        {itemCount} item{itemCount > 1 ? 's' : ''} · Cash on delivery
        {order.rating ? ` · Rated ${order.rating}★` : ''}
      </div>
    </motion.button>
  )
}
