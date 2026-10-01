import { motion } from 'framer-motion'
import { Bell, ChevronRight, Heart, LogIn, LogOut, MapPin, Package, Settings, Store } from 'lucide-react'
import { useNavigate } from 'react-router'
import { BrandLogo } from '../../components/shared/BrandLogo'
import { Button } from '../../components/shared/Button'
import { listContainer, listItem } from '../../components/shared/PageTransition'
import { useCustomer } from '../../context/CustomerContext'
import { useToast } from '../../context/ToastContext'

export function AccountScreen() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signedIn, setSignedIn, orders, favorites } = useCustomer()

  const menu = [
    { label: 'Saved addresses', icon: MapPin, to: '/customer/account/addresses' },
    { label: 'Order history', icon: Package, to: '/customer/orders' },
    { label: 'Wishlist', icon: Heart, to: '/customer/favorites' },
    { label: 'Notifications', icon: Bell, to: '/customer/account/notifications' },
    { label: 'Settings', icon: Settings, to: '/customer/account/settings' },
  ]

  return (
    <div className="no-scrollbar h-full overflow-y-auto px-5 pb-8 pt-2">
      <h1 className="text-[22px] font-bold tracking-tight text-fg">Account</h1>

      <motion.div
        key={String(signedIn)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 flex items-center gap-4"
      >
        <div className="grid size-16 place-items-center rounded-full gold-gradient text-xl font-bold text-gold-ink shadow-glow">
          {signedIn ? 'JC' : 'G'}
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-semibold text-fg">{signedIn ? 'Joud Chamaa' : 'Guest user'}</div>
          <div className="text-sm text-muted">{signedIn ? 'joud@example.com' : 'Not signed in'}</div>
        </div>
      </motion.div>

      {!signedIn && (
        <Button
          className="mt-4"
          block
          icon={<LogIn className="size-4" />}
          onClick={() => {
            setSignedIn(true)
            toast({ title: 'Signed in as demo user', description: 'Joud Chamaa' })
          }}
        >
          Continue as demo user
        </Button>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[
          { label: 'Orders', value: orders.length },
          { label: 'Favorites', value: favorites.length },
          { label: 'Reviews', value: orders.filter((o) => o.rating).length },
        ].map((s) => (
          <div key={s.label} className="card-surface rounded-2xl py-3 text-center">
            <div className="text-lg font-bold text-fg">{s.value}</div>
            <div className="text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <motion.ul variants={listContainer} initial="initial" animate="enter" className="mt-5">
        {menu.map((m) => (
          <motion.li key={m.label} variants={listItem}>
            <button
              onClick={() => navigate(m.to)}
              className="flex w-full items-center gap-3.5 border-b border-line py-4 text-left text-[15px] text-fg transition-colors hover:text-gold"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-surface text-gold">
                <m.icon className="size-[18px]" />
              </span>
              <span className="flex-1">{m.label}</span>
              <ChevronRight className="size-4 text-dim" />
            </button>
          </motion.li>
        ))}
      </motion.ul>

      {/* Bridge to the business story */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/business')}
        className="mt-6 flex w-full items-center gap-3 rounded-[20px] border border-gold/30 bg-gold/8 p-4 text-left"
      >
        <span className="grid size-10 place-items-center rounded-xl gold-gradient text-gold-ink">
          <Store className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-fg">Own a business?</span>
          <span className="block text-xs text-muted">Open your own store on Brandora</span>
        </span>
        <ChevronRight className="size-4 text-gold" />
      </motion.button>

      {signedIn && (
        <button
          onClick={() => {
            setSignedIn(false)
            toast({ title: 'Signed out', tone: 'info' })
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-danger hover:bg-danger/10"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      )}

      <div className="mt-8 flex flex-col items-center gap-1.5 opacity-60">
        <BrandLogo size="sm" />
        <span className="text-[11px] text-dim">Version 1.0 · Demo build</span>
      </div>
    </div>
  )
}
