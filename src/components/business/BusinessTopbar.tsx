import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CreditCard, ExternalLink, LogOut, Menu, Package, Paintbrush, Search, ShoppingBag, Star, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useBusiness } from '../../context/BusinessContext'
import { useToast } from '../../context/ToastContext'
import { BUSINESS_NOTIFICATIONS } from '../../data/analytics'
import { cn } from '../../lib/utils'
import { Modal } from '../shared/Modal'
import { BrowserFrame, storeSlug, usePreviewProducts } from './previewHelpers'
import { StorefrontPreview } from './StorefrontPreview'

const NOTIF_ICONS = { order: ShoppingBag, stock: Package, review: Star, billing: CreditCard }

function useClickOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, close])
  return ref
}

export function BusinessTopbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const biz = useBusiness()
  const products = usePreviewProducts()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const [storeOpen, setStoreOpen] = useState(false)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [query, setQuery] = useState('')

  const notifRef = useClickOutside(notifOpen, () => setNotifOpen(false))
  const profileRef = useClickOutside(profileOpen, () => setProfileOpen(false))

  const search = () => {
    const q = query.trim()
    if (!q) return
    navigate(/^br-?\d+/i.test(q) ? '/business/orders' : '/business/products', { state: { q } })
    setQuery('')
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-bg/70 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenu} className="grid size-10 place-items-center rounded-xl text-muted hover:bg-surface hover:text-fg lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </button>

      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold text-fg">{biz.profile.storeName}</div>
        <div className="hidden text-[11px] text-dim sm:block">{storeSlug(biz.profile.storeName)}.brandora.store</div>
      </div>

      <label className="ml-4 hidden h-10 max-w-sm flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm md:flex">
        <Search className="size-4 text-dim" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search orders or products…"
          className="min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-dim"
        />
        <kbd className="rounded-md border border-line px-1.5 text-[10px] text-dim">↵</kbd>
      </label>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setStoreOpen(true)}
          className="hidden items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-[13px] font-semibold text-fg transition-colors hover:border-gold/50 hover:text-gold sm:flex"
        >
          <ExternalLink className="size-4" /> View storefront
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((o) => !o)
              setProfileOpen(false)
            }}
            className="relative grid size-10 place-items-center rounded-xl text-muted hover:bg-surface hover:text-fg"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {unread && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-gold ring-2 ring-bg" />}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-12 z-50 w-[340px] origin-top-right overflow-hidden rounded-2xl border border-line-strong bg-surface-2 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <span className="text-sm font-semibold text-fg">Notifications</span>
                  <button onClick={() => setUnread(false)} className="text-xs font-semibold text-gold disabled:text-dim" disabled={!unread}>
                    Mark all read
                  </button>
                </div>
                <ul>
                  {BUSINESS_NOTIFICATIONS.map((n) => {
                    const Icon = NOTIF_ICONS[n.kind]
                    return (
                      <li key={n.id}>
                        <button
                          onClick={() => {
                            setNotifOpen(false)
                            navigate(n.kind === 'order' ? '/business/orders' : n.kind === 'stock' ? '/business/inventory' : n.kind === 'billing' ? '/business/subscription' : '/business/analytics')
                          }}
                          className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-3/60"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-gold">
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-[13px] font-semibold text-fg">{n.title}</span>
                              <span className="shrink-0 text-[10.5px] text-dim">{n.time}</span>
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-muted">{n.body}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen((o) => !o)
              setNotifOpen(false)
            }}
            className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-surface"
            aria-label="Profile menu"
          >
            <span className="grid size-8 place-items-center rounded-full gold-gradient text-xs font-bold text-gold-ink">JC</span>
            <span className="hidden text-left leading-tight xl:block">
              <span className="block text-[13px] font-semibold text-fg">Joud Chamaa</span>
              <span className="block text-[11px] text-dim">Owner</span>
            </span>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-12 z-50 w-60 origin-top-right overflow-hidden rounded-2xl border border-line-strong bg-surface-2 p-1.5 shadow-2xl"
              >
                <div className="px-3 py-2.5">
                  <div className="text-sm font-semibold text-fg">Joud Chamaa</div>
                  <div className="text-xs text-muted">joud@example.com</div>
                </div>
                {[
                  { label: 'Staff & permissions', icon: User, to: '/business/staff' },
                  { label: 'Website builder', icon: Paintbrush, to: '/business/builder' },
                  { label: 'Billing & subscription', icon: CreditCard, to: '/business/subscription' },
                ].map((i) => (
                  <button
                    key={i.label}
                    onClick={() => {
                      setProfileOpen(false)
                      navigate(i.to)
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-fg hover:bg-surface-3/60"
                  >
                    <i.icon className="size-4 text-muted" /> {i.label}
                  </button>
                ))}
                <div className="my-1 border-t border-line" />
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    toast({ title: 'Switched to the customer app', tone: 'info' })
                    navigate('/customer/home')
                  }}
                  className={cn('flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-danger hover:bg-danger/10')}
                >
                  <LogOut className="size-4" /> Exit dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Modal open={storeOpen} onClose={() => setStoreOpen(false)} title="Your live storefront" description="This is what customers see when they open your store." width="max-w-6xl">
        <BrowserFrame url={`${storeSlug(biz.profile.storeName)}.brandora.store`} device={device} onDeviceChange={setDevice} className="h-[70dvh]">
          <StorefrontPreview
            theme={biz.storeTheme}
            logo={biz.logo}
            storeName={biz.profile.storeName}
            builder={biz.builder}
            products={products}
            device={device}
          />
        </BrowserFrame>
      </Modal>
    </header>
  )
}
