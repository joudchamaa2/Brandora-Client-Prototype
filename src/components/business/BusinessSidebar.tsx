import { motion } from 'framer-motion'
import {
  BarChart3,
  Boxes,
  CreditCard,
  LayoutDashboard,
  Package,
  Paintbrush,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  Users,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { useBusiness } from '../../context/BusinessContext'
import { stockState } from '../../data/adminProducts'
import { cn } from '../../lib/utils'
import { LogoSymbol } from '../visuals/LogoMark'

export const DASHBOARD_NAV = [
  { to: '/business/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/business/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/business/products', label: 'Products', icon: Package },
  { to: '/business/inventory', label: 'Inventory', icon: Boxes },
  { to: '/business/builder', label: 'Website Builder', icon: Paintbrush },
  { to: '/business/offers', label: 'Offers', icon: TicketPercent },
  { to: '/business/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/business/staff', label: 'Staff', icon: Users },
  { to: '/business/subscription', label: 'Subscription', icon: CreditCard },
]

export function BusinessSidebar({ className }: { className?: string }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { profile, logo, storeTheme, plan, adminOrders, products } = useBusiness()

  const badges: Record<string, number> = {
    '/business/orders': adminOrders.filter((o) => o.status === 'Pending' || o.status === 'Accepted').length,
    '/business/inventory': products.filter((p) => p.status !== 'Archived' && stockState(p.stock) !== 'In stock').length,
  }

  return (
    <aside className={cn('w-64 shrink-0 flex-col border-r border-line bg-bg-2/95', className)}>
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <LogoSymbol logo={logo} name={profile.storeName} size={38} primary={storeTheme.primary} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-fg">{profile.storeName}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" /> Store live
          </div>
        </div>
      </div>

      <nav className="thin-scrollbar flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-dim">Manage</div>
        <ul className="space-y-0.5">
          {DASHBOARD_NAV.map((item) => {
            const active = pathname === item.to
            const badge = badges[item.to]
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={cn(
                    'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors',
                    active ? 'text-fg' : 'text-muted hover:bg-surface/60 hover:text-fg',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl border border-gold/25 bg-gradient-to-r from-gold/15 to-surface/40"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  {active && (
                    <motion.span layoutId="sidebar-bar" className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full gold-gradient" />
                  )}
                  <item.icon className={cn('relative size-[18px]', active ? 'text-gold' : '')} />
                  <span className="relative flex-1">{item.label}</span>
                  {badge ? (
                    <span className="relative rounded-full bg-gold/15 px-2 py-0.5 text-[10.5px] font-bold text-gold">{badge}</span>
                  ) : null}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-3">
        <button
          onClick={() => navigate('/business/subscription')}
          className="w-full rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/12 to-transparent p-4 text-left transition-colors hover:border-gold/50"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-gold">
            <Sparkles className="size-3.5" /> {plan.name} plan
          </div>
          <div className="mt-1 text-[12px] text-muted">${plan.price}/month · Renews Nov 2</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full w-[68%] rounded-full gold-gradient" />
          </div>
          <div className="mt-1.5 text-[10.5px] text-dim">21 days left in this billing cycle</div>
        </button>
      </div>
    </aside>
  )
}
