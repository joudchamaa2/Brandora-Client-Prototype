import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { CartButton, ScreenHeader } from '../../components/customer/ScreenHeader'
import { Button } from '../../components/shared/Button'
import { Segmented } from '../../components/shared/Segmented'
import { ProductArt } from '../../components/visuals/ProductArt'
import { useCustomer } from '../../context/CustomerContext'
import { useToast } from '../../context/ToastContext'
import { getProduct } from '../../data/products'
import { getStore } from '../../data/stores'
import type { PriceMode } from '../../data/types'
import { readableOn } from '../../lib/color'
import { cn } from '../../lib/utils'

interface Flight {
  id: number
  left: number
  top: number
  size: number
  dx: number
  dy: number
}

export function ProductScreen() {
  const { id } = useParams()
  const product = getProduct(id)
  if (!product) return <Navigate to="/customer/home" replace />
  return <ProductDetails key={product.id} productId={product.id} />
}

function ProductDetails({ productId }: { productId: string }) {
  const product = getProduct(productId)!
  const store = getStore(product.storeId)!
  const navigate = useNavigate()
  const { addToCart } = useCustomer()
  const { toast } = useToast()

  const [mode, setMode] = useState<PriceMode>('retail')
  const [size, setSize] = useState(product.sizes[0])
  const [color, setColor] = useState(product.colors[0])
  const [qty, setQty] = useState(1)
  const [flight, setFlight] = useState<Flight | null>(null)
  const [justAdded, setJustAdded] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLButtonElement>(null)

  const hasWholesale = product.wholesalePrice !== undefined
  const minQty = mode === 'wholesale' ? (product.minWholesale ?? 1) : 1
  const unit = mode === 'wholesale' && hasWholesale ? product.wholesalePrice! : product.price
  const total = unit * qty
  const savings = hasWholesale ? Math.round((1 - product.wholesalePrice! / product.price) * 100) : 0

  const switchMode = (m: PriceMode) => {
    setMode(m)
    setQty(m === 'wholesale' ? (product.minWholesale ?? 1) : 1)
  }

  const handleAdd = () => {
    const root = rootRef.current?.getBoundingClientRect()
    const art = artRef.current?.getBoundingClientRect()
    const cart = cartRef.current?.getBoundingClientRect()
    if (root && art && cart) {
      const size = Math.min(art.width, art.height) * 0.55
      const left = art.left - root.left + (art.width - size) / 2
      const top = art.top - root.top + (art.height - size) / 2
      setFlight({
        id: Date.now(),
        left,
        top,
        size,
        dx: cart.left - root.left + cart.width / 2 - (left + size / 2),
        dy: cart.top - root.top + cart.height / 2 - (top + size / 2),
      })
    }
    // Add after the flight lands so the badge bump lines up with the animation
    setTimeout(() => {
      addToCart({ productId: product.id, storeId: product.storeId, size, color: color.name, mode, unitPrice: unit, qty })
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1600)
      toast({
        title: 'Added to cart',
        description: `${product.name}${size ? ` · ${size}` : ''} × ${qty}`,
        action: { label: 'View cart', onClick: () => navigate('/customer/cart') },
      })
    }, 650)
  }

  return (
    <div ref={rootRef} className="relative flex h-full flex-col">
      <ScreenHeader back right={<CartButton ref={cartRef} />} />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6">
        <motion.div ref={artRef} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
          <ProductArt kind={product.kind} color={color.hex} className="aspect-[4/3] w-full" rounded="rounded-[26px]" scale={0.66} />
        </motion.div>

        <div className="mt-5 text-center">
          <Link to={`/customer/store/${store.id}`} className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-gold">
            {store.name} {store.verified && <ShieldCheck className="size-3.5 text-gold" />}
          </Link>
          <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-fg">{product.name}</h1>
          <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-muted">
            <Star className="size-3.5 fill-gold text-gold" /> {product.rating} · {store.reviews} reviews
          </div>
        </div>

        {/* Retail / Wholesale */}
        <div className="mt-5">
          {hasWholesale ? (
            <Segmented
              tone="gold"
              className="flex w-full"
              value={mode}
              onChange={switchMode}
              options={[
                { value: 'retail', label: 'Retail' },
                { value: 'wholesale', label: 'Wholesale' },
              ]}
            />
          ) : (
            <div className="rounded-2xl border border-line bg-surface px-4 py-2.5 text-center text-xs text-muted">
              Retail only · Wholesale not offered by this store
            </div>
          )}
        </div>

        <div className="mt-4 flex h-[68px] flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={unit}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="font-display text-[38px] font-bold leading-none text-gold"
            >
              ${unit}
              {mode === 'wholesale' && <span className="ml-1 text-sm font-medium text-muted">/ piece</span>}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {mode === 'wholesale' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs text-success"
              >
                Save {savings}% · Min. order {product.minWholesale} pcs
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Color */}
        {product.colors.length > 1 && (
          <div className="mt-5">
            <div className="mb-2.5 flex items-center justify-between text-sm">
              <span className="font-semibold text-fg">Color</span>
              <span className="text-muted">{color.name}</span>
            </div>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <motion.button
                  key={c.name}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                  className={cn(
                    'grid size-10 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-bg transition-all',
                    color.name === c.name ? 'ring-gold' : 'ring-transparent hover:ring-line-strong',
                  )}
                  style={{ background: c.hex }}
                >
                  {color.name === c.name && <Check className="size-4" style={{ color: readableOn(c.hex) }} />}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        {product.sizes.length > 0 && (
          <div className="mt-5">
            <div className="mb-2.5 flex items-center justify-between text-sm">
              <span className="font-semibold text-fg">Size</span>
              <button className="text-xs text-muted underline-offset-2 hover:text-gold hover:underline" onClick={() => toast({ title: 'Size guide', description: 'S 46–48 · M 50–52 · L 54–56 · XL 58–60 (EU)', tone: 'info' })}>
                Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const active = s === size
                return (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSize(s)}
                    className={cn(
                      'relative h-12 min-w-12 rounded-xl border px-3 text-sm font-bold transition-colors',
                      active ? 'border-gold bg-gold/10 text-gold' : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg',
                    )}
                  >
                    {s}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-surface p-2 pl-4">
          <span className="text-sm font-semibold text-fg">Quantity</span>
          <div className="flex items-center gap-1">
            <QtyButton label="Decrease" disabled={qty <= minQty} onClick={() => setQty((q) => Math.max(minQty, q - 1))}>
              <Minus className="size-4" />
            </QtyButton>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={qty}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="w-9 text-center text-[15px] font-bold tabular-nums text-fg"
              >
                {qty}
              </motion.span>
            </AnimatePresence>
            <QtyButton label="Increase" onClick={() => setQty((q) => q + 1)}>
              <Plus className="size-4" />
            </QtyButton>
          </div>
        </div>

        <p className="mt-5 text-[13.5px] leading-relaxed text-muted">{product.description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <Truck className="size-4 text-gold" /> Delivery in {store.deliveryTime} · Cash on delivery
        </div>
      </div>

      <div className="shrink-0 border-t border-line/60 bg-bg/95 px-5 pb-6 pt-3 backdrop-blur">
        <Button size="lg" block onClick={handleAdd} disabled={!!flight}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={justAdded ? 'added' : `add-${total}`}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="flex items-center gap-2"
            >
              {justAdded ? (
                <>
                  <Check className="size-5" /> Added to cart
                </>
              ) : (
                <>Add to cart — ${total.toLocaleString('en-US')}</>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>

      {/* Product "flies" into the cart button */}
      <AnimatePresence>
        {flight && (
          <motion.div
            key={flight.id}
            className="pointer-events-none absolute z-40"
            style={{ left: flight.left, top: flight.top, width: flight.size, height: flight.size }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{ x: flight.dx, y: flight.dy, scale: 0.12, opacity: 0.5, rotate: 18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.55, 0, 0.75, 0.3] }}
            onAnimationComplete={() => setFlight(null)}
          >
            <ProductArt kind={product.kind} color={color.hex} className="size-full shadow-glow" rounded="rounded-3xl" scale={0.75} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function QtyButton({ children, label, onClick, disabled }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-line bg-surface-2 text-fg transition-colors hover:border-gold/50 disabled:opacity-35"
    >
      {children}
    </motion.button>
  )
}
