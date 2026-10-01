import { motion } from 'framer-motion'
import { Check, Crown, Gem, Rocket, Sprout } from 'lucide-react'
import type { Plan } from '../../data/types'
import { cn } from '../../lib/utils'

const ICONS = { starter: Sprout, growth: Rocket, premium: Gem, enterprise: Crown }

export function PlanCard({ plan, selected, onSelect, current }: { plan: Plan; selected: boolean; onSelect: () => void; current?: boolean }) {
  const Icon = ICONS[plan.id]
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      animate={{ scale: selected ? 1.025 : 1, y: selected ? -4 : 0 }}
      whileHover={{ y: selected ? -4 : -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      aria-pressed={selected}
      className={cn(
        'relative flex h-full flex-col rounded-3xl border p-6 text-left transition-[border-color,box-shadow,background] duration-300',
        selected
          ? 'border-gold bg-gradient-to-b from-gold/10 to-surface shadow-[0_24px_60px_-28px_rgba(232,185,72,0.55)]'
          : 'border-line bg-surface hover:border-line-strong',
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-6 rounded-full gold-gradient px-3 py-1 text-[11px] font-bold text-gold-ink shadow-glow">
          {plan.highlight}
        </span>
      )}
      {current && (
        <span className="absolute -top-3 right-6 rounded-full bg-success px-3 py-1 text-[11px] font-bold text-ink">Current plan</span>
      )}

      <div className="flex items-start justify-between">
        <div className={cn('grid size-11 place-items-center rounded-2xl transition-colors', selected ? 'bg-gold/20 text-gold' : 'bg-surface-2 text-muted')}>
          <Icon className="size-5" />
        </div>
        <motion.div
          initial={false}
          animate={{ scale: selected ? 1 : 0.6, opacity: selected ? 1 : 0 }}
          className="grid size-7 place-items-center rounded-full gold-gradient"
        >
          <Check className="size-4 text-gold-ink" strokeWidth={3} />
        </motion.div>
      </div>

      <div className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-muted">{plan.name}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn('font-display text-[40px] font-bold leading-none transition-colors', selected ? 'text-gold' : 'text-fg')}>
          ${plan.price}
        </span>
        <span className="text-sm text-muted">/ month</span>
      </div>
      <p className="mt-2 text-[13px] text-muted">{plan.tagline}</p>

      <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-fg">
            <Check className={cn('mt-0.5 size-4 shrink-0', selected ? 'text-gold' : 'text-success')} />
            {f}
          </li>
        ))}
      </ul>
    </motion.button>
  )
}
