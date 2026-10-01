import { animate, AnimatePresence, motion } from 'framer-motion'
import { Banknote, Check, Clock, MapPin, MessageCircle, Package, Phone, ShieldCheck, Star, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { ScreenHeader } from '../../components/customer/ScreenHeader'
import { IconButton } from '../../components/shared/Button'
import { Segmented } from '../../components/shared/Segmented'
import { orderStage, useCustomer } from '../../context/CustomerContext'
import { useToast } from '../../context/ToastContext'
import { TRACKING_STEPS } from '../../data/orders'
import { getStore } from '../../data/stores'
import type { OrderStage } from '../../data/types'
import { useNow } from '../../lib/usePersistentState'
import { cn, initials, money } from '../../lib/utils'

const STEP_ICONS = [Check, Package, Clock, Truck, ShieldCheck]

const ROUTE = 'M30 120 C 80 120, 70 40, 140 50 S 220 110, 290 36'

/* Stylised route map — the van advances with the order stage */
function RouteMap({ stage }: { stage: OrderStage }) {
  const progress = [0.04, 0.2, 0.35, 0.72, 1][stage]
  const pathRef = useRef<SVGPathElement>(null)
  const from = useRef(0)
  const [pt, setPt] = useState({ x: 30, y: 120 })

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    const controls = animate(from.current, progress, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const p = el.getPointAtLength(len * v)
        setPt({ x: p.x, y: p.y })
      },
    })
    from.current = progress
    return () => controls.stop()
  }, [progress])

  return (
    <div className="relative h-36 overflow-hidden rounded-[22px] border border-line bg-[#0c1328]">
      <svg viewBox="0 0 320 150" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {/* streets */}
        {[20, 60, 100, 140].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#16213e" strokeWidth="10" />
        ))}
        {[50, 120, 190, 260].map((x) => (
          <line key={x} y1="0" y2="150" x1={x} x2={x} stroke="#16213e" strokeWidth="10" />
        ))}
        <path ref={pathRef} d={ROUTE} fill="none" stroke="#2a3860" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 8" />
        <motion.path
          d={ROUTE}
          fill="none"
          stroke="#E8B948"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <circle cx="30" cy="120" r="7" fill="#111a32" stroke="#E8B948" strokeWidth="2.5" />
        <circle cx="290" cy="36" r="8" fill="#E8B948" />
        <circle cx="290" cy="36" r="3" fill="#080C18" />
        <g transform={`translate(${pt.x} ${pt.y})`}>
          <circle r="17" fill="#E8B948" opacity="0.2" />
          <circle r="13" fill="#E8B948" />
          <Truck x={-7.5} y={-7.5} width={15} height={15} color="#1A1300" strokeWidth={2.2} />
        </g>
      </svg>
      <div className="absolute bottom-2.5 left-3 rounded-full bg-bg/80 px-2.5 py-1 text-[10px] font-semibold text-muted backdrop-blur">Store</div>
      <div className="absolute right-3 top-2.5 rounded-full bg-bg/80 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur">You</div>
    </div>
  )
}

function RateOrder({ orderId, rating }: { orderId: string; rating?: number }) {
  const { rateOrder } = useCustomer()
  const { toast } = useToast()
  const [hover, setHover] = useState(0)
  const shown = hover || rating || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 24 }}
      className="card-surface mt-5 rounded-[22px] p-5 text-center"
    >
      <div className="text-[15px] font-semibold text-fg">{rating ? 'Thanks for your rating!' : 'Rate your order'}</div>
      <div className="mt-1 text-xs text-muted">{rating ? 'Your feedback helps stores improve.' : 'How was your experience?'}</div>
      <div className="mt-4 flex justify-center gap-2" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.button
            key={n}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onMouseEnter={() => setHover(n)}
            onClick={() => {
              rateOrder(orderId, n)
              toast({ title: `You rated this order ${n}★`, description: 'Thank you for your feedback!' })
            }}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <motion.span
              animate={n <= shown ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, delay: rating ? n * 0.05 : 0 }}
              className="block"
            >
              <Star className={cn('size-9 transition-colors', n <= shown ? 'fill-gold text-gold' : 'text-gold/50')} strokeWidth={1.5} />
            </motion.span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function TrackingScreen() {
  const { id } = useParams()
  const { orders, setOrderStage } = useCustomer()
  const { toast } = useToast()
  const now = useNow(500)
  const order = orders.find((o) => o.id === id)
  if (!order) return <Navigate to="/customer/orders" replace />

  const store = getStore(order.storeId)!
  const stage = orderStage(order, now)
  const delivered = stage === 4

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader back="/customer/orders" title={`Order ${order.id}`} />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
        <div className="text-center text-[13px] text-muted">
          From {store.name} · {money(order.total)}
        </div>

        {/* Demo control: lets the presenter jump between the two tracking states */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">Demo</span>
          <Segmented
            size="sm"
            value={delivered ? 'delivered' : 'progress'}
            onChange={(v) => setOrderStage(order.id, v === 'delivered' ? 4 : 3)}
            options={[
              { value: 'progress', label: 'In progress' },
              { value: 'delivered', label: 'Delivered' },
            ]}
          />
        </div>

        <div className="mt-4">
          <RouteMap stage={stage} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={delivered ? 'done' : 'eta'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3"
          >
            <div>
              <div className="text-xs text-muted">{delivered ? 'Delivered' : 'Estimated arrival'}</div>
              <div className="text-[17px] font-bold text-fg">{delivered ? 'Enjoy your order!' : `${Math.max(4, 22 - stage * 5)} min`}</div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">
              <Banknote className="size-3.5" /> {money(order.total)} cash
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline */}
        <ol className="mt-6">
          {TRACKING_STEPS.map((step, i) => {
            const done = i < stage || delivered
            const current = i === stage && !delivered
            const Icon = STEP_ICONS[i]
            const last = i === TRACKING_STEPS.length - 1
            return (
              <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
                {!last && (
                  <div className="absolute left-[21px] top-11 h-[calc(100%-44px)] w-[2px] overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      className="w-full bg-gold"
                      initial={false}
                      animate={{ height: i < stage ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                  </div>
                )}
                <div className="relative">
                  {current && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-gold/40"
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                  <motion.div
                    initial={false}
                    animate={{ scale: current ? 1.06 : 1 }}
                    className={cn(
                      'relative grid size-11 place-items-center rounded-full transition-colors duration-500',
                      done || current ? 'gold-gradient text-gold-ink' : 'border border-line bg-surface text-dim',
                    )}
                  >
                    <Icon className="size-[18px]" strokeWidth={2.2} />
                  </motion.div>
                </div>
                <div className="flex-1 pt-1">
                  <div className={cn('text-[15px] font-semibold transition-colors', done || current ? 'text-fg' : 'text-dim')}>{step.label}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {current ? <span className="font-medium text-gold">In progress…</span> : done ? step.hint : 'Pending'}
                  </div>
                  {i === 3 && stage >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
                    >
                      <div className="grid size-10 place-items-center rounded-full bg-surface-3 text-sm font-bold text-gold">
                        {initials(order.driver.name)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-fg">Driver: {order.driver.name}</div>
                        <div className="text-xs text-muted">{order.driver.rating} ★ · Brandora Delivery</div>
                      </div>
                      {!delivered && (
                        <>
                          <IconButton
                            label="Message driver"
                            className="size-9"
                            onClick={() => toast({ title: `Chat with ${order.driver.name}`, description: 'In-app chat opens here in the full app.', tone: 'info' })}
                          >
                            <MessageCircle className="size-4" />
                          </IconButton>
                          <IconButton
                            label="Call driver"
                            className="size-9"
                            onClick={() => toast({ title: `Calling ${order.driver.name}…`, description: 'Calls are simulated in this demo.', tone: 'info' })}
                          >
                            <Phone className="size-4" />
                          </IconButton>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        <AnimatePresence>{delivered && <RateOrder key="rate" orderId={order.id} rating={order.rating} />}</AnimatePresence>

        {/* Items */}
        <div className="card-surface mt-5 rounded-[22px] p-4">
          <div className="mb-2 text-sm font-semibold text-fg">Order details</div>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted">
                {it.name} {it.size && `· ${it.size}`} × {it.qty}
              </span>
              <span className="text-fg">{money(it.unitPrice * it.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between py-1.5 text-[13px]">
            <span className="text-muted">Delivery</span>
            <span className="text-fg">{money(order.delivery)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-line pt-2.5 text-sm font-bold">
            <span className="text-fg">Total</span>
            <span className="text-gold">{money(order.total)}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <MapPin className="size-3.5 text-gold" /> {order.address}
          </div>
        </div>
      </div>
    </div>
  )
}
