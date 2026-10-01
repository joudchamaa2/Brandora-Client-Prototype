import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { LogoOption, ThemeOption } from '../../data/types'
import { cn } from '../../lib/utils'
import { MiniStorefront } from './previewHelpers'

export function ThemeCard({
  theme,
  logo,
  storeName,
  selected,
  onSelect,
  index = 0,
}: {
  theme: ThemeOption
  logo: LogoOption
  storeName: string
  selected: boolean
  onSelect: () => void
  index?: number
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-surface text-left transition-[border-color,box-shadow] duration-300',
        selected ? 'border-gold shadow-[0_18px_44px_-22px_rgba(232,185,72,0.6)]' : 'border-line hover:border-line-strong',
      )}
    >
      <MiniStorefront logo={logo} theme={theme} storeName={storeName} className="aspect-[4/3] w-full border-b border-line" />
      <div className="flex items-start justify-between gap-2 p-3.5">
        <div>
          <div className="text-sm font-semibold text-fg">{theme.name}</div>
          <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-muted">{theme.description}</div>
        </div>
        <motion.span
          initial={false}
          animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          className="grid size-6 shrink-0 place-items-center rounded-full gold-gradient"
        >
          <Check className="size-3.5 text-gold-ink" strokeWidth={3} />
        </motion.span>
      </div>
    </motion.button>
  )
}
