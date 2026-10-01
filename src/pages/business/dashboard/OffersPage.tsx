import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Copy, Plus, TicketPercent } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Field, inputClass, PageHeader, TabFilter } from '../../../components/business/DashboardUI'
import { Button } from '../../../components/shared/Button'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Modal } from '../../../components/shared/Modal'
import { Segmented } from '../../../components/shared/Segmented'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import type { Offer, OfferStatus } from '../../../data/types'
import { useRouteIntent } from '../../../lib/useRouteIntent'
import { cn, moneyShort } from '../../../lib/utils'

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const { toggleOffer } = useBusiness()
  const { toast } = useToast()
  const active = offer.status === 'Active'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card-surface relative flex overflow-hidden rounded-3xl"
    >
      {/* ticket stub */}
      <div
        className={cn(
          'relative flex w-32 shrink-0 flex-col items-center justify-center border-r border-dashed border-line-strong p-4 text-center',
          active ? 'bg-gradient-to-b from-gold/20 to-gold/5' : 'bg-surface-2/50',
        )}
      >
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-bg" />
        <span className="absolute -bottom-3 -right-3 size-6 rounded-full bg-bg" />
        <TicketPercent className={cn('size-5', active ? 'text-gold' : 'text-dim')} />
        <div className={cn('mt-2 font-display text-2xl font-bold leading-tight', active ? 'text-gold' : 'text-muted')}>{offer.value}</div>
      </div>
      <div className="min-w-0 flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-fg">{offer.name}</div>
            <div className="mt-0.5 text-[13px] text-muted">{offer.description}</div>
          </div>
          <StatusBadge status={offer.status} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(offer.code).catch(() => undefined)
              toast({ title: 'Code copied', description: offer.code, tone: 'info' })
            }}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-gold/40 px-2.5 py-1 font-mono text-[12px] font-semibold text-gold hover:bg-gold/10"
          >
            {offer.code} <Copy className="size-3" />
          </button>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> {offer.starts} → {offer.ends}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <div className="flex gap-6 text-xs">
            <div>
              <div className="text-dim">Redemptions</div>
              <div className="mt-0.5 text-sm font-semibold text-fg">{offer.redemptions}</div>
            </div>
            <div>
              <div className="text-dim">Revenue</div>
              <div className="mt-0.5 text-sm font-semibold text-fg">{moneyShort(offer.revenue)}</div>
            </div>
          </div>
          {offer.status !== 'Scheduled' && (
            <button
              onClick={() => {
                toggleOffer(offer.id)
                toast({ title: active ? 'Offer paused' : 'Offer activated', description: offer.name, tone: active ? 'info' : 'success' })
              }}
              className="text-xs font-semibold text-gold hover:underline"
            >
              {active ? 'End offer' : 'Reactivate'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CreateOfferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addOffer } = useBusiness()
  const { toast } = useToast()
  const [type, setType] = useState<'percent' | 'fixed' | 'bxgy'>('percent')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('15')
  const [code, setCode] = useState('')
  const [when, setWhen] = useState<'now' | 'later'>('now')

  const value = type === 'percent' ? `${amount || 0}% OFF` : type === 'fixed' ? `$${amount || 0} OFF` : 'B1G1'
  const valid = name.trim() && (type === 'bxgy' || Number(amount) > 0)

  const submit = () => {
    const status: OfferStatus = when === 'now' ? 'Active' : 'Scheduled'
    addOffer({
      name: name.trim(),
      value,
      description: type === 'bxgy' ? 'Buy one item, get the second free.' : `${value} on eligible products.`,
      code: (code.trim() || name.replace(/\s+/g, '').slice(0, 8)).toUpperCase(),
      status,
      starts: when === 'now' ? 'Oct 2, 2026' : 'Oct 15, 2026',
      ends: 'Oct 31, 2026',
    })
    toast({ title: status === 'Active' ? 'Offer is live' : 'Offer scheduled', description: `${name.trim()} · ${value}` })
    setName('')
    setCode('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create offer"
      description="Promotions appear on your storefront and in the Brandora app."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit}>
            Create offer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Offer name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Weekend Flash Sale" autoFocus />
        </Field>
        <Field label="Discount type">
          <Segmented
            className="flex w-full"
            value={type}
            onChange={setType}
            options={[
              { value: 'percent', label: 'Percentage' },
              { value: 'fixed', label: 'Fixed amount' },
              { value: 'bxgy', label: 'Buy 1 Get 1' },
            ]}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          {type !== 'bxgy' && (
            <Field label={type === 'percent' ? 'Discount (%)' : 'Discount ($)'}>
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
            </Field>
          )}
          <Field label="Promo code" hint="Optional — generated if empty">
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={cn(inputClass, 'font-mono uppercase')} placeholder="FLASH15" />
          </Field>
        </div>
        <Field label="Start">
          <Segmented
            className="flex w-full"
            value={when}
            onChange={setWhen}
            options={[
              { value: 'now', label: 'Start now' },
              { value: 'later', label: 'Schedule (Oct 15)' },
            ]}
          />
        </Field>
        <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/8 p-4">
          <TicketPercent className="size-5 text-gold" />
          <span className="text-sm text-muted">
            Preview: <span className="font-semibold text-fg">{name || 'Your offer'}</span> · <span className="font-bold text-gold">{value}</span>
          </span>
        </div>
      </div>
    </Modal>
  )
}

export function OffersPage() {
  const intent = useRouteIntent<{ add: boolean }>()
  const { offers } = useBusiness()
  const [tab, setTab] = useState<OfferStatus>('Active')
  const [creating, setCreating] = useState(!!intent.add)

  useEffect(() => {
    if (intent.add) setCreating(true)
  }, [intent])

  const list = offers.filter((o) => o.status === tab)
  const activeRevenue = offers.filter((o) => o.status === 'Active').reduce((s, o) => s + o.revenue, 0)

  return (
    <>
      <PageHeader
        title="Offers & Promotions"
        description={`${offers.filter((o) => o.status === 'Active').length} active offers generated ${moneyShort(activeRevenue)} in revenue.`}
        actions={
          <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
            Create offer
          </Button>
        }
      />
      <div className="mb-5">
        <TabFilter<OfferStatus>
          value={tab}
          onChange={setTab}
          tabs={(['Active', 'Scheduled', 'Expired'] as OfferStatus[]).map((s) => ({ value: s, label: s, count: offers.filter((o) => o.status === s).length }))}
        />
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<TicketPercent className="size-7" />} title={`No ${tab.toLowerCase()} offers`} description="Create an offer to drive more sales." />
      ) : (
        <motion.div layout className="grid gap-4 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((o, i) => (
              <OfferCard key={o.id} offer={o} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      <CreateOfferModal open={creating} onClose={() => setCreating(false)} />
    </>
  )
}
