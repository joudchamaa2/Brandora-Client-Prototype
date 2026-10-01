import { motion } from 'framer-motion'
import { ArrowRight, Check, Clock, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router'
import { storeSlug } from '../../../components/business/previewHelpers'
import { Button } from '../../../components/shared/Button'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { SuccessCheck } from '../../../components/shared/SuccessCheck'
import { LogoMark } from '../../../components/visuals/LogoMark'
import { useBusiness } from '../../../context/BusinessContext'
import { cn } from '../../../lib/utils'

const TIMELINE = [
  { label: 'Store submitted', hint: 'Just now', icon: Check, state: 'done' },
  { label: 'Brandora review', hint: 'Usually within 24 hours', icon: Clock, state: 'active' },
  { label: 'Launch on the marketplace', hint: 'Customers can find and order', icon: Rocket, state: 'todo' },
] as const

export function SubmittedPage() {
  const navigate = useNavigate()
  const { profile, logo, plan, themeOption, storeTheme } = useBusiness()

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:py-16">
      <SuccessCheck size={112} />
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-8 text-4xl font-bold tracking-tight text-fg"
      >
        Your store is ready
      </motion.h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-4">
        <StatusBadge status="Pending approval" className="animate-pulse px-3 py-1.5 text-xs" />
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-4 max-w-md text-muted">
        Your store has been submitted and is being prepared for launch.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="card-surface mt-10 w-full rounded-3xl p-6 text-left"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <LogoMark logo={logo} name={profile.storeName} size={44} primary={storeTheme.primary} />
          <span className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-muted">{storeSlug(profile.storeName)}.brandora.store</span>
        </div>
        <div className="grid grid-cols-3 gap-4 border-b border-line py-5 text-sm">
          <div>
            <div className="text-xs text-dim">Plan</div>
            <div className="mt-1 font-semibold text-fg">
              {plan.name} · ${plan.price}/mo
            </div>
          </div>
          <div>
            <div className="text-xs text-dim">Theme</div>
            <div className="mt-1 font-semibold text-fg">{themeOption.name}</div>
          </div>
          <div>
            <div className="text-xs text-dim">Logo</div>
            <div className="mt-1 font-semibold text-fg">{logo.name}</div>
          </div>
        </div>
        <ol className="pt-5">
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.12 }}
              className="relative flex gap-4 pb-5 last:pb-0"
            >
              {i < TIMELINE.length - 1 && <span className="absolute left-[17px] top-10 h-[calc(100%-36px)] w-px bg-line" />}
              <span
                className={cn(
                  'relative grid size-9 shrink-0 place-items-center rounded-full',
                  t.state === 'done' && 'gold-gradient text-gold-ink',
                  t.state === 'active' && 'border border-warn bg-warn/10 text-warn',
                  t.state === 'todo' && 'border border-line text-dim',
                )}
              >
                <t.icon className="size-4" />
              </span>
              <div>
                <div className={cn('text-sm font-semibold', t.state === 'todo' ? 'text-dim' : 'text-fg')}>{t.label}</div>
                <div className="text-xs text-muted">{t.hint}</div>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
        <Button size="lg" className="mt-10 min-w-[260px]" onClick={() => navigate('/business/dashboard')}>
          Enter Store Dashboard <ArrowRight className="size-4" />
        </Button>
      </motion.div>
    </div>
  )
}
