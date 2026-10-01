import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export const ONBOARDING_STEPS = ['Plan', 'Brand', 'Theme', 'Preview'] as const

/**
 * Horizontal stepper. `current` is 1-based; 0 means not started yet and
 * values above the step count mean everything is complete.
 */
export function StepIndicator({ current }: { current: number }) {
  const total = ONBOARDING_STEPS.length
  const progress = Math.min(1, Math.max(0, (current - 1) / (total - 1)))

  return (
    <div className="relative mx-auto w-full max-w-xl px-4">
      <div className="absolute left-[calc(12.5%)] right-[calc(12.5%)] top-[18px] h-[2px] rounded-full bg-line">
        <motion.div
          className="h-full rounded-full gold-gradient"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ol className="relative grid grid-cols-4">
        {ONBOARDING_STEPS.map((label, i) => {
          const n = i + 1
          const done = n < current
          const active = n === current
          return (
            <li key={label} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                className={cn(
                  'relative grid size-9 place-items-center rounded-full text-sm font-bold transition-colors duration-300',
                  done && 'gold-gradient text-gold-ink',
                  active && 'border-2 border-gold bg-bg text-gold',
                  !done && !active && 'border border-line bg-surface text-dim',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="step-glow"
                    className="absolute -inset-1.5 rounded-full border border-gold/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {done ? <Check className="size-4" strokeWidth={3} /> : n}
              </motion.div>
              <span className={cn('text-xs font-semibold transition-colors', active || done ? 'text-fg' : 'text-dim')}>{label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
