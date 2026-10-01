import { motion } from 'framer-motion'
import { Banknote, ChevronLeft, Clock, MapPin, Share2, ShieldCheck, Star } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { HeartButton } from '../../components/customer/HeartButton'
import { ProductCard } from '../../components/customer/ProductCard'
import { CartButton } from '../../components/customer/ScreenHeader'
import { IconButton } from '../../components/shared/Button'
import { listContainer } from '../../components/shared/PageTransition'
import { StoreCover, StoreLogo } from '../../components/visuals/StoreVisual'
import { useToast } from '../../context/ToastContext'
import { productsForStore } from '../../data/products'
import { getStore } from '../../data/stores'

export function StoreScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const store = getStore(id)
  if (!store) return <Navigate to="/customer/home" replace />

  const products = productsForStore(store.id)

  const share = async () => {
    const url = `${window.location.origin}/customer/store/${store.id}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard may be blocked — still show the confirmation for the demo */
    }
    toast({ title: 'Store link copied', description: 'Share it on WhatsApp or Instagram', tone: 'info' })
  }

  return (
    <div className="no-scrollbar relative h-full overflow-y-auto pb-8">
      {/* Cover */}
      <motion.div initial={{ scale: 1.06, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        <StoreCover store={store} className="h-44 rounded-none border-x-0 border-t-0" iconSize={52} />
      </motion.div>
      <div className="absolute inset-x-0 top-2 flex items-center justify-between px-4">
        <IconButton label="Back" onClick={() => navigate(-1)} className="bg-bg/70 backdrop-blur">
          <ChevronLeft className="size-5" />
        </IconButton>
        <div className="flex gap-2">
          <IconButton label="Share store" onClick={share} className="bg-bg/70 backdrop-blur">
            <Share2 className="size-4" />
          </IconButton>
          <HeartButton storeId={store.id} size="md" />
          <CartButton className="bg-bg/70 backdrop-blur" />
        </div>
      </div>

      <div className="relative px-5">
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
          className="-mt-9"
        >
          <StoreLogo store={store} size={72} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-[24px] font-bold tracking-tight text-fg">{store.name}</h1>
            {store.verified && <ShieldCheck className="size-5 text-gold" aria-label="Verified" />}
          </div>
          <div className="mt-1 text-sm text-muted">
            {store.tagline} · {store.wholesale ? 'Retail + Wholesale' : 'Retail'}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-gold text-gold" />
            <span className="font-semibold text-fg">{store.rating}</span>
            <span className="text-dim">({store.reviews} reviews)</span>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{store.description}</p>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {[
              { icon: Clock, label: store.deliveryTime },
              { icon: MapPin, label: store.location },
              { icon: Banknote, label: 'Cash on delivery' },
            ].map((c) => (
              <span key={c.label} className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-fg">
                <c.icon className="size-3.5 text-gold" /> {c.label}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="mb-3 mt-7 flex items-baseline justify-between">
          <h2 className="text-[17px] font-bold text-fg">Products</h2>
          <span className="text-xs text-muted">{products.length} items</span>
        </div>
        <motion.div variants={listContainer} initial="initial" animate="enter" className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
