import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Sparkline } from '../charts/Sparkline'
import { AnimatedNumber } from '../shared/AnimatedNumber'

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}

export function Card({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn('card-surface rounded-3xl', className)}
    >
      {children}
    </motion.div>
  )
}

export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className,
  delay,
}: {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Card className={cn('p-5 sm:p-6', className)} delay={delay}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
          {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  )
}

interface StatProps {
  label: string
  value: number
  format?: (n: number) => string
  delta?: number
  deltaSuffix?: string
  icon: ReactNode
  spark?: number[]
  sparkColor?: string
  hint?: string
  delay?: number
}

export function StatCard({ label, value, format, delta, deltaSuffix = '%', icon, spark, sparkColor, hint, delay = 0 }: StatProps) {
  const up = (delta ?? 0) >= 0
  return (
    <Card className="flex flex-col p-5" delay={delay}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        <span className="grid size-9 place-items-center rounded-xl bg-surface-2 text-gold">{icon}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <AnimatedNumber value={value} format={format} className="font-display text-[28px] font-bold leading-none text-fg" />
        {spark && <Sparkline values={spark} color={sparkColor} width={84} height={30} />}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {delta !== undefined && (
          <span className={cn('flex items-center gap-0.5 font-semibold', up ? 'text-success' : 'text-danger')}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta)}
            {deltaSuffix}
          </span>
        )}
        <span className="text-dim">{hint ?? 'vs. previous period'}</span>
      </div>
    </Card>
  )
}

/** Simple data table shell with consistent styling */
export function Table({
  head,
  children,
  className,
  minWidth = 'min-w-[720px]',
}: {
  head: ReactNode
  children: ReactNode
  className?: string
  minWidth?: string
}) {
  return (
    <div className={cn('thin-scrollbar overflow-x-auto', className)}>
      <table className={cn('w-full border-separate border-spacing-0 text-left text-sm', minWidth)}>
        <thead>
          <tr className="text-[11.5px] font-semibold uppercase tracking-wider text-dim [&>th]:border-b [&>th]:border-line [&>th]:px-4 [&>th]:py-3 [&>th]:font-semibold">
            {head}
          </tr>
        </thead>
        <tbody className="[&>tr>td]:border-b [&>tr>td]:border-line/60 [&>tr>td]:px-4 [&>tr>td]:py-3.5 [&>tr:last-child>td]:border-0">
          {children}
        </tbody>
      </table>
    </div>
  )
}

export function TabFilter<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="thin-scrollbar flex gap-1 overflow-x-auto">
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-colors',
              active ? 'text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`tabfilter-${tabs.map((x) => x.value).join('')}`}
                className="absolute inset-0 rounded-xl bg-surface-3"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{t.label}</span>
            {t.count !== undefined && (
              <span className={cn('relative rounded-full px-1.5 py-px text-[10.5px]', active ? 'bg-gold/20 text-gold' : 'bg-surface-2 text-dim')}>
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-fg">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-dim">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'h-11 w-full rounded-xl border border-line bg-bg-2 px-3.5 text-sm text-fg outline-none transition-colors placeholder:text-dim focus:border-gold/60'
