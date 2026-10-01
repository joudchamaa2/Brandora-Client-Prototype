import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useCustomer } from '../../context/CustomerContext'
import { useToast } from '../../context/ToastContext'
import { getStore } from '../../data/stores'
import { cn } from '../../lib/utils'

/** Animated favorite toggle for a store */
export function HeartButton({ storeId, className, size = 'sm' }: { storeId: string; className?: string; size?: 'sm' | 'md' }) {
  const { isFavorite, toggleFavorite } = useCustomer()
  const { toast } = useToast()
  const fav = isFavorite(storeId)

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation()
        const added = toggleFavorite(storeId)
        const name = getStore(storeId)?.name ?? 'Store'
        toast({ title: added ? 'Saved to favorites' : 'Removed from favorites', description: name, tone: added ? 'success' : 'info' })
      }}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={fav}
      className={cn(
        'relative grid place-items-center rounded-full bg-bg/70 backdrop-blur-md transition-colors hover:bg-bg/90',
        size === 'sm' ? 'size-8' : 'size-10 border border-line',
        className,
      )}
    >
      <AnimatePresence>
        {fav && (
          <motion.span
            key="burst"
            className="absolute inset-0 rounded-full border-2 border-gold"
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 1.7, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <motion.span
        key={fav ? 'on' : 'off'}
        initial={{ scale: fav ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 12 }}
      >
        <Heart
          className={cn(size === 'sm' ? 'size-4' : 'size-[18px]', fav ? 'fill-gold text-gold' : 'text-muted')}
          strokeWidth={2}
        />
      </motion.span>
    </motion.button>
  )
}
