import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router'
import { StoreCard } from '../../components/customer/StoreCard'
import { Button } from '../../components/shared/Button'
import { EmptyState } from '../../components/shared/EmptyState'
import { listContainer } from '../../components/shared/PageTransition'
import { useCustomer } from '../../context/CustomerContext'
import { STORES } from '../../data/stores'

export function FavoritesScreen() {
  const navigate = useNavigate()
  const { favorites } = useCustomer()
  const stores = STORES.filter((s) => favorites.includes(s.id))

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-[22px] font-bold tracking-tight text-fg">Favorites</h1>
        {stores.length > 0 && <p className="mt-1 text-xs text-muted">{stores.length} saved stores</p>}
      </div>
      <div className="no-scrollbar mt-4 flex-1 overflow-y-auto px-5 pb-6">
        {stores.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={<Heart className="size-7" />}
              title="No favorites yet"
              description="Tap the heart on any store to save it."
              action={<Button onClick={() => navigate('/customer/home')}>Discover stores</Button>}
            />
          </div>
        ) : (
          <motion.div variants={listContainer} initial="initial" animate="enter" className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {stores.map((s) => (
                <motion.div key={s.id} layout exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}>
                  <StoreCard store={s} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
