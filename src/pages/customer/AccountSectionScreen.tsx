import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Briefcase, Check, Gift, Home, MapPin, Package, Plus, Star, Store } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { ScreenHeader } from '../../components/customer/ScreenHeader'
import { Button } from '../../components/shared/Button'
import { listContainer, listItem } from '../../components/shared/PageTransition'
import { Segmented } from '../../components/shared/Segmented'
import { useToast } from '../../context/ToastContext'
import { usePersistentState } from '../../lib/usePersistentState'
import { cn } from '../../lib/utils'

const TITLES: Record<string, string> = {
  addresses: 'Saved addresses',
  notifications: 'Notifications',
  settings: 'Settings',
}

export function AccountSectionScreen() {
  const { section = '' } = useParams()
  if (!TITLES[section]) return <Navigate to="/customer/account" replace />

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader back="/customer/account" title={TITLES[section]} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
        {section === 'addresses' && <Addresses />}
        {section === 'notifications' && <Notifications />}
        {section === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
}

/* ------------------------------- Addresses ------------------------------- */

interface Address {
  id: string
  label: string
  line: string
  icon: 'home' | 'work' | 'pin'
}

const EXTRA = [
  { label: 'Gym', line: 'Charles Helou Avenue, Beirut' },
  { label: "Parents'", line: 'Main Road, Broummana' },
  { label: 'Studio', line: 'Pasteur Street, Gemmayze' },
]

function Addresses() {
  const { toast } = useToast()
  const [addresses, setAddresses] = usePersistentState<Address[]>('addresses', [
    { id: 'a1', label: 'Home', line: 'Bliss Street, Hamra, Beirut', icon: 'home' },
    { id: 'a2', label: 'Work', line: 'Armenia Street, Mar Mikhael, Beirut', icon: 'work' },
  ])
  const [defaultId, setDefaultId] = usePersistentState('defaultAddress', 'a1')
  const Icon = { home: Home, work: Briefcase, pin: MapPin }

  return (
    <>
      <motion.div variants={listContainer} initial="initial" animate="enter" className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {addresses.map((a) => {
            const I = Icon[a.icon]
            const isDefault = a.id === defaultId
            return (
              <motion.button
                layout
                key={a.id}
                variants={listItem}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setDefaultId(a.id)}
                className={cn(
                  'card-surface flex items-center gap-3 rounded-2xl p-4 text-left transition-colors',
                  isDefault && 'border-gold/60',
                )}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-gold/10 text-gold">
                  <I className="size-[18px]" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-fg">{a.label}</span>
                  <span className="block text-xs text-muted">{a.line}</span>
                </span>
                {isDefault && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-gold">
                    <Check className="size-3.5" /> Default
                  </span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </motion.div>
      <Button
        variant="secondary"
        block
        className="mt-4"
        icon={<Plus className="size-4" />}
        disabled={addresses.length >= 2 + EXTRA.length}
        onClick={() => {
          const next = EXTRA[addresses.length - 2]
          if (!next) return
          setAddresses((prev) => [...prev, { id: `a${Date.now()}`, ...next, icon: 'pin' }])
          toast({ title: 'Address saved', description: next.line })
        }}
      >
        Add new address
      </Button>
      <p className="mt-3 text-center text-xs text-dim">Tap an address to make it your default.</p>
    </>
  )
}

/* ----------------------------- Notifications ----------------------------- */

const NOTIFICATIONS = [
  { icon: Package, title: 'Your order was delivered', body: 'BR-34859 from Nova Streetwear', time: 'Yesterday', unread: false },
  { icon: Gift, title: 'Summer Sale is live', body: '20% off at Nova Streetwear this week', time: '2 h ago', unread: true },
  { icon: Store, title: 'New store on Brandora', body: 'Glow Beauty Bar just joined — take a look', time: '5 h ago', unread: true },
  { icon: Star, title: 'Rate your last order', body: 'How was your Oversized Bomber Jacket?', time: '1 d ago', unread: false },
  { icon: Bell, title: 'Welcome to Brandora', body: 'Discover verified stores near you', time: '3 d ago', unread: false },
]

function Notifications() {
  const [read, setRead] = useState(false)
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={() => setRead(true)} className="text-xs font-semibold text-gold disabled:text-dim" disabled={read}>
          Mark all as read
        </button>
      </div>
      <motion.div variants={listContainer} initial="initial" animate="enter" className="flex flex-col gap-2.5">
        {NOTIFICATIONS.map((n) => (
          <motion.div key={n.title} variants={listItem} className="card-surface flex gap-3 rounded-2xl p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-3 text-gold">
              <n.icon className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-fg">{n.title}</span>
                <span className="shrink-0 text-[10.5px] text-dim">{n.time}</span>
              </div>
              <div className="mt-0.5 text-xs text-muted">{n.body}</div>
            </div>
            {n.unread && !read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" />}
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

/* -------------------------------- Settings -------------------------------- */

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-gold' : 'bg-surface-3')}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 32 }}
        className={cn('absolute top-1 size-5 rounded-full bg-white shadow', on ? 'right-1' : 'left-1')}
      />
    </button>
  )
}

function SettingsPanel() {
  const [prefs, setPrefs] = usePersistentState('prefs', { push: true, sms: false, offers: true })
  const [lang, setLang] = usePersistentState<'en' | 'ar'>('lang', 'en')

  const rows: { key: keyof typeof prefs; label: string; hint: string }[] = [
    { key: 'push', label: 'Push notifications', hint: 'Order updates and delivery alerts' },
    { key: 'sms', label: 'SMS updates', hint: 'Get a text when your driver is close' },
    { key: 'offers', label: 'Offers & promotions', hint: 'Deals from stores you follow' },
  ]

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.key} className="card-surface flex items-center gap-3 rounded-2xl p-4">
          <div className="flex-1">
            <div className="text-sm font-semibold text-fg">{r.label}</div>
            <div className="text-xs text-muted">{r.hint}</div>
          </div>
          <Toggle label={r.label} on={prefs[r.key]} onChange={(v) => setPrefs({ ...prefs, [r.key]: v })} />
        </div>
      ))}
      <div className="card-surface flex items-center gap-3 rounded-2xl p-4">
        <div className="flex-1">
          <div className="text-sm font-semibold text-fg">Language</div>
          <div className="text-xs text-muted">{lang === 'en' ? 'English' : 'العربية'}</div>
        </div>
        <Segmented
          size="sm"
          value={lang}
          onChange={setLang}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'ar', label: 'عربي' },
          ]}
        />
      </div>
      <div className="card-surface flex items-center justify-between rounded-2xl p-4 text-sm">
        <span className="font-semibold text-fg">Currency</span>
        <span className="text-muted">USD ($)</span>
      </div>
      <div className="card-surface flex items-center justify-between rounded-2xl p-4 text-sm">
        <span className="font-semibold text-fg">Appearance</span>
        <span className="text-muted">Brandora Dark</span>
      </div>
    </div>
  )
}
