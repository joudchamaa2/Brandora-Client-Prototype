import { motion } from 'framer-motion'
import { Heart, Home, Package, Search, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { useCustomer } from '../../context/CustomerContext'
import { cn } from '../../lib/utils'

const ITEMS = [
  { path: '/customer/home', label: 'Home', icon: Home },
  { path: '/customer/search', label: 'Search', icon: Search },
  { path: '/customer/orders', label: 'Orders', icon: Package },
  { path: '/customer/favorites', label: 'Favorites', icon: Heart },
  { path: '/customer/account', label: 'Account', icon: User },
]

export const TAB_PATHS = ITEMS.map((i) => i.path)

export function CustomerBottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { favorites } = useCustomer()

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 34 }}
      className="relative z-20 flex shrink-0 border-t border-line bg-surface/95 px-1.5 pb-5 pt-2 backdrop-blur-xl sm:pb-6"
    >
      {ITEMS.map((it) => {
        const active = pathname === it.path
        return (
          <button
            key={it.path}
            onClick={() => navigate(it.path)}
            className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
            aria-current={active ? 'page' : undefined}
          >
            {active && (
              <motion.span
                layoutId="bottom-nav-active"
                className="absolute -top-2 h-[3px] w-8 rounded-full gold-gradient"
                transition={{ type: 'spring', stiffness: 480, damping: 36 }}
              />
            )}
            <span className="relative">
              <it.icon
                className={cn('size-[22px] transition-colors', active ? 'text-gold' : 'text-dim')}
                strokeWidth={active ? 2.2 : 1.8}
              />
              {it.label === 'Favorites' && favorites.length > 0 && (
                <motion.span
                  key={favorites.length}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-gold text-[9px] font-bold text-gold-ink"
                >
                  {favorites.length}
                </motion.span>
              )}
            </span>
            <span className={cn('text-[10.5px] transition-colors', active ? 'font-semibold text-gold' : 'text-dim')}>
              {it.label}
            </span>
          </button>
        )
      })}
    </motion.nav>
  )
}
