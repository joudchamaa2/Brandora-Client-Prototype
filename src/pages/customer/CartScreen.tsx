import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ScreenHeader } from '../../components/customer/ScreenHeader'
import { AnimatedNumber } from '../../components/shared/AnimatedNumber'
import { Button } from '../../components/shared/Button'
import { EmptyState } from '../../components/shared/EmptyState'
import { ProductArt } from '../../components/visuals/ProductArt'
import { useCustomer } from '../../context/CustomerContext'
import { getProduct } from '../../data/products'
import { getStore } from '../../data/stores'
import { money } from '../../lib/utils'

export function CartScreen() {
  const navigate = useNavigate()
  const { cart, updateQty, removeFromCart, subtotal, deliveryFee, cartCount } = useCustomer()
  const total = subtotal + deliveryFee

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader back title="Your cart" right={cartCount > 0 && <span className="text-xs text-muted">{cartCount} items</span>} />

      {cart.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={<ShoppingBag className="size-7" />}
            title="Your cart is empty"
            description="Discover verified stores and add something you love."
            action={<Button onClick={() => navigate('/customer/home')}>Browse stores</Button>}
          />
        </div>
      ) : (
        <>
          <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4">
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {cart.map((item, i) => {
                  const product = getProduct(item.productId)!
                  const store = getStore(item.storeId)!
                  const color = product.colors.find((c) => c.name === item.color) ?? product.colors[0]
                  return (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                      exit={{ opacity: 0, x: -60, height: 0, marginTop: -12, transition: { duration: 0.3 } }}
                      className="card-surface relative flex gap-3 overflow-hidden rounded-[20px] p-3"
                    >
                      <ProductArt kind={product.kind} color={color.hex} className="size-[84px] shrink-0" rounded="rounded-2xl" scale={0.72} />
                      <div className="min-w-0 flex-1 pr-6">
                        <div className="truncate text-[14px] font-semibold text-fg">{product.name}</div>
                        <div className="mt-0.5 truncate text-xs text-muted">
                          {store.name}
                          {item.size && ` · Size ${item.size}`}
                          {product.colors.length > 1 && ` · ${color.name}`}
                        </div>
                        {item.mode === 'wholesale' && (
                          <span className="mt-1 inline-block rounded-full bg-info/12 px-2 py-0.5 text-[10px] font-semibold text-info">
                            Wholesale
                          </span>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-gold">
                            ${item.unitPrice} × {item.qty}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(item.key, -1)}
                              className="grid size-8 place-items-center rounded-full border border-line text-fg hover:border-gold/50"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={item.qty}
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -8, opacity: 0 }}
                                className="w-7 text-center text-sm font-bold tabular-nums text-fg"
                              >
                                {item.qty}
                              </motion.span>
                            </AnimatePresence>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQty(item.key, 1)}
                              className="grid size-8 place-items-center rounded-full border border-line text-fg hover:border-gold/50"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        aria-label="Remove item"
                        className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full text-dim hover:bg-danger/10 hover:text-danger"
                      >
                        <X className="size-4" />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
            <button
              onClick={() => navigate('/customer/home')}
              className="mt-4 w-full rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-muted hover:border-gold/40 hover:text-gold"
            >
              + Add more items
            </button>
          </div>

          <div className="shrink-0 border-t border-line bg-bg-2/80 px-5 pb-6 pt-4 backdrop-blur">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Delivery" value={deliveryFee} />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[17px] font-bold text-fg">Total</span>
              <AnimatedNumber value={total} format={(n) => money(n)} className="text-[19px] font-bold text-fg" />
            </div>
            <Button size="lg" block className="mt-4" onClick={() => navigate('/customer/checkout')}>
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted">{label}</span>
      <AnimatedNumber value={value} format={(n) => money(n)} className="text-muted" />
    </div>
  )
}
