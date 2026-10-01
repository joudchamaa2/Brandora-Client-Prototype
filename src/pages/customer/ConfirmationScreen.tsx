import { motion } from 'framer-motion'
import { Banknote, Clock, MapPin } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button } from '../../components/shared/Button'
import { SuccessCheck } from '../../components/shared/SuccessCheck'
import { StoreLogo } from '../../components/visuals/StoreVisual'
import { useCustomer } from '../../context/CustomerContext'
import { getStore } from '../../data/stores'
import { money } from '../../lib/utils'

/* Small gold particles bursting out of the check */
function Confetti() {
  const pieces = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2
    return { x: Math.cos(angle) * (90 + (i % 3) * 25), y: Math.sin(angle) * (90 + (i % 3) * 25), r: i * 40 }
  })
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-sm"
          style={{ width: i % 2 ? 6 : 8, height: i % 2 ? 6 : 3, background: i % 3 ? '#E8B948' : '#F5F7FB' }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], rotate: p.r }}
          transition={{ delay: 0.35, duration: 1.1, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export function ConfirmationScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders } = useCustomer()
  const order = orders.find((o) => o.id === id)
  if (!order) return <Navigate to="/customer/orders" replace />
  const store = getStore(order.storeId)!
  const extra = orders.filter((o) => o.placedAt === order.placedAt && o.id !== order.id)

  return (
    <div className="flex h-full flex-col px-6 pb-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative">
          <Confetti />
          <SuccessCheck />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 text-[24px] font-bold tracking-tight text-fg"
        >
          Order placed successfully
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-2 text-sm text-muted">
          {store.name} has received your order.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-surface mt-7 w-full rounded-[22px] p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <StoreLogo store={store} size={46} />
            <div className="flex-1">
              <div className="text-xs text-muted">Order</div>
              <div className="text-[17px] font-bold text-fg">{order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted">Total</div>
              <div className="text-[17px] font-bold text-gold">{money(order.total)}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-[13px]">
            <div className="flex items-center gap-2.5 text-muted">
              <Clock className="size-4 text-gold" /> Estimated delivery · <span className="text-fg">{store.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted">
              <MapPin className="size-4 text-gold" /> <span className="truncate text-fg">{order.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted">
              <Banknote className="size-4 text-gold" /> Cash on delivery
            </div>
          </div>
          {extra.length > 0 && (
            <div className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted">
              + {extra.length} more order{extra.length > 1 ? 's' : ''} from other stores ({extra.map((e) => e.id).join(', ')})
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="space-y-2.5">
        <Button size="lg" block onClick={() => navigate(`/customer/order/${order.id}`, { replace: true })}>
          Track order
        </Button>
        <Button size="md" variant="ghost" block onClick={() => navigate('/customer/home')}>
          Continue shopping
        </Button>
      </motion.div>
    </div>
  )
}
