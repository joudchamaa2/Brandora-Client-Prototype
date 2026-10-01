import { motion } from 'framer-motion'
import { ShieldCheck, Star } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { Store } from '../../data/types'
import { listItem } from '../shared/PageTransition'
import { StoreCover } from '../visuals/StoreVisual'
import { HeartButton } from './HeartButton'

export function StoreCard({ store }: { store: Store }) {
  const navigate = useNavigate()
  return (
    <motion.div
      layout
      variants={listItem}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/customer/store/${store.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/customer/store/${store.id}`)}
      className="card-surface group relative cursor-pointer rounded-[20px] p-3 transition-colors hover:border-line-strong"
    >
      <div className="relative">
        <StoreCover store={store} className="h-[104px] rounded-[14px]" iconSize={32} />
        <HeartButton storeId={store.id} className="absolute right-2 top-2" />
      </div>
      <div className="px-1 pb-1 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[14.5px] font-semibold text-fg">{store.name}</span>
          {store.verified && <ShieldCheck className="size-3.5 shrink-0 text-gold" aria-label="Verified store" />}
        </div>
        <div className="mt-0.5 text-xs text-muted">{store.tagline}</div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-fg">
            <Star className="size-3.5 fill-gold text-gold" />
            {store.rating}
          </span>
          {store.featured && (
            <span className="rounded-full bg-gold/12 px-2 py-0.5 text-[10px] font-semibold text-gold">Featured</span>
          )}
          {!store.featured && store.wholesale && (
            <span className="rounded-full bg-info/12 px-2 py-0.5 text-[10px] font-semibold text-info">Wholesale</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
