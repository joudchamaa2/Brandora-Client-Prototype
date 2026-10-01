import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { Product } from '../../data/types'
import { listItem } from '../shared/PageTransition'
import { ProductArt } from '../visuals/ProductArt'

export function ProductCard({ product, showStore }: { product: Product; showStore?: string }) {
  const navigate = useNavigate()
  return (
    <motion.button
      layout
      variants={listItem}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/customer/product/${product.id}`)}
      className="card-surface relative flex flex-col rounded-[20px] p-2.5 text-left transition-colors hover:border-line-strong"
    >
      <ProductArt kind={product.kind} color={product.colors[0].hex} className="aspect-[4/3.4] w-full" rounded="rounded-[14px]" />
      {product.badge && (
        <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-2 py-0.5 text-[10px] font-semibold text-gold backdrop-blur">
          {product.badge}
        </span>
      )}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-2.5">
        {showStore && <span className="mb-0.5 text-[10.5px] text-dim">{showStore}</span>}
        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-fg">{product.name}</span>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[15px] font-bold text-gold">${product.price}</span>
          <span className="flex items-center gap-0.5 text-[11px] text-muted">
            <Star className="size-3 fill-gold text-gold" />
            {product.rating}
          </span>
        </div>
      </div>
    </motion.button>
  )
}
