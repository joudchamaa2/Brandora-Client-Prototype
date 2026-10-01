import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '../../lib/utils'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  className?: string
  /** "gold" uses the brand accent for the active pill, "surface" a subtle navy pill */
  tone?: 'gold' | 'surface'
}

/** Segmented control with an animated sliding indicator */
export function Segmented<T extends string>({ options, value, onChange, size = 'md', className, tone = 'surface' }: Props<T>) {
  const id = useId()
  return (
    <div
      role="tablist"
      className={cn('inline-flex rounded-full border border-line bg-bg-2/80 p-1', className)}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative flex-1 whitespace-nowrap rounded-full font-semibold transition-colors',
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-[13px]',
              active ? (tone === 'gold' ? 'text-gold-ink' : 'text-fg') : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className={cn('absolute inset-0 rounded-full', tone === 'gold' ? 'gold-gradient' : 'bg-surface-3')}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
