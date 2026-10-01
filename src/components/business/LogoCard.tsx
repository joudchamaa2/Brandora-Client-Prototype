import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { LogoOption } from '../../data/types'
import { cn } from '../../lib/utils'
import { LogoMark } from '../visuals/LogoMark'

export function LogoCard({ logo, storeName, selected, onSelect, index }: { logo: LogoOption; storeName: string; selected: boolean; onSelect: () => void; index: number }) {
  const p = logo.palette
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, scale: selected ? 1.02 : 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 320, damping: 28 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={cn(
        'group relative overflow-hidden rounded-3xl border text-left transition-[border-color,box-shadow] duration-300',
        selected ? 'border-gold shadow-[0_20px_50px_-24px_rgba(232,185,72,0.6)]' : 'border-line hover:border-line-strong',
      )}
    >
      <div className="relative grid h-44 place-items-center" style={{ background: `radial-gradient(circle at 50% 40%, ${p.primary}22, transparent 65%), ${p.dark}` }}>
        <motion.div animate={{ scale: selected ? 1.06 : 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          <LogoMark logo={logo} name={storeName} size={58} layout="stacked" on="dark" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full gold-gradient shadow-glow"
        >
          <Check className="size-4 text-gold-ink" strokeWidth={3} />
        </motion.div>
      </div>
      <div className="bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-fg">{logo.name}</span>
          <div className="flex -space-x-1.5">
            {[p.primary, p.secondary, p.dark, p.light].map((c) => (
              <span key={c} className="size-5 rounded-full border-2 border-surface" style={{ background: c }} />
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">{logo.description}</p>
      </div>
    </motion.button>
  )
}
