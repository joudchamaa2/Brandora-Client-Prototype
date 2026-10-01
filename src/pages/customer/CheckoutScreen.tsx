import { motion } from 'framer-motion'
import { Banknote, Check, Home, Info, MapPin, StickyNote } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ScreenHeader } from '../../components/customer/ScreenHeader'
import { AnimatedNumber } from '../../components/shared/AnimatedNumber'
import { Button } from '../../components/shared/Button'
import { useCustomer } from '../../context/CustomerContext'
import { money, sleep } from '../../lib/utils'
import { SummaryRow } from './CartScreen'

const SAVED_ADDRESSES = ['Bliss Street, Hamra, Beirut', 'Armenia Street, Mar Mikhael, Beirut']

export function CheckoutScreen() {
  const navigate = useNavigate()
  const { cart, subtotal, deliveryFee, cartCount, placeOrder } = useCustomer()
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)
  const total = subtotal + deliveryFee

  if (cart.length === 0 && !placing) return <Navigate to="/customer/cart" replace />

  const submit = async () => {
    setPlacing(true)
    await sleep(1100)
    const [order] = placeOrder(address.trim())
    navigate(`/customer/confirmation/${order.id}`, { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader back title="Checkout" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4">
        <section>
          <h2 className="mb-2.5 text-sm font-semibold text-fg">Delivery address</h2>
          <label className="flex h-[52px] items-center gap-3 rounded-2xl border border-line bg-surface px-4 transition-colors focus-within:border-gold/60">
            <MapPin className="size-[18px] shrink-0 text-gold" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-muted"
            />
          </label>
          <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
            {SAVED_ADDRESSES.map((a, i) => (
              <button
                key={a}
                onClick={() => setAddress(a)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-gold/50 hover:text-fg"
              >
                <Home className="size-3.5 text-gold" /> {i === 0 ? 'Home' : 'Work'} · {a.split(',')[1]?.trim()}
              </button>
            ))}
          </div>
          <label className="mt-3 flex min-h-[48px] items-center gap-3 rounded-2xl border border-line bg-surface px-4 transition-colors focus-within:border-gold/60">
            <StickyNote className="size-4 shrink-0 text-dim" />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery notes (optional)"
              className="min-w-0 flex-1 bg-transparent py-3 text-[13px] text-fg outline-none placeholder:text-muted"
            />
          </label>
        </section>

        <section className="mt-7">
          <h2 className="mb-2.5 text-sm font-semibold text-fg">Payment method</h2>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3.5 rounded-2xl border border-gold bg-gold/8 p-4"
          >
            <div className="grid size-11 place-items-center rounded-xl bg-gold/15">
              <Banknote className="size-5 text-gold" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-fg">Cash on delivery</div>
              <div className="text-xs text-muted">Pay the driver when your order arrives</div>
            </div>
            <div className="grid size-6 place-items-center rounded-full gold-gradient">
              <Check className="size-3.5 text-gold-ink" strokeWidth={3} />
            </div>
          </motion.div>
          <p className="mt-2.5 flex items-start gap-2 text-[11.5px] leading-relaxed text-dim">
            <Info className="mt-px size-3.5 shrink-0" /> All Brandora customer orders are paid in cash on delivery.
          </p>
        </section>

        <section className="card-surface mt-7 rounded-[20px] px-4 py-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-fg">Order summary</span>
            <span className="text-xs text-muted">{cartCount} items</span>
          </div>
          <SummaryRow label="Subtotal" value={subtotal} />
          <SummaryRow label="Delivery" value={deliveryFee} />
          <div className="mt-1.5 flex items-center justify-between border-t border-line pt-2.5">
            <span className="text-base font-bold text-fg">Total</span>
            <AnimatedNumber value={total} format={(n) => money(n)} className="text-lg font-bold text-fg" />
          </div>
        </section>
      </div>

      <div className="shrink-0 border-t border-line/60 bg-bg/95 px-5 pb-6 pt-3">
        {!address.trim() && <p className="mb-2 text-center text-xs text-dim">Enter a delivery address to continue</p>}
        <Button size="lg" block disabled={!address.trim()} loading={placing} onClick={submit}>
          {placing ? 'Placing order…' : `Place order — ${money(total)}`}
        </Button>
      </div>
    </div>
  )
}
