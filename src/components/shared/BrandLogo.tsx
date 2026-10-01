import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { cn } from '../../lib/utils'

const SIZES = {
  sm: { letters: 17, b: 25, bag: 9, gap: 1, tag: 0 },
  md: { letters: 26, b: 38, bag: 13, gap: 1.5, tag: 9 },
  lg: { letters: 40, b: 58, bag: 18, gap: 2, tag: 11 },
  xl: { letters: 46, b: 68, bag: 21, gap: 2.5, tag: 12 },
} as const

interface Props {
  size?: keyof typeof SIZES
  animated?: boolean
  tagline?: boolean
  className?: string
}

const GOLD = '#E8B948'
const WHITE = '#F5F7FB'

/**
 * The Brandora wordmark: an oversized "B" carrying a gold shopping bag,
 * followed by "RANDORA" with gold "A"s.
 */
export function BrandLogo({ size = 'md', animated = false, tagline = false, className }: Props) {
  const s = SIZES[size]
  const letters = 'RANDORA'.split('')

  return (
    <div className={cn('inline-flex flex-col items-center', className)} aria-label="Brandora">
      <div className="flex items-end font-display font-bold leading-none" style={{ gap: s.gap }}>
        <motion.span
          className="relative inline-block"
          initial={animated ? { opacity: 0, scale: 0.6, y: 8 } : false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: s.b, color: WHITE, lineHeight: 0.8 }}
        >
          B
          <motion.span
            className="absolute"
            style={{ left: s.b * 0.08, bottom: -s.b * 0.02 }}
            initial={animated ? { opacity: 0, scale: 0, rotate: -25 } : false}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: animated ? 0.95 : 0, type: 'spring', stiffness: 380, damping: 16 }}
          >
            <ShoppingBag size={s.bag} color={GOLD} strokeWidth={2.4} fill="#080C18" />
          </motion.span>
        </motion.span>
        <span className="flex" style={{ fontSize: s.letters, letterSpacing: s.letters * 0.04, lineHeight: 0.8 }}>
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              initial={animated ? { opacity: 0, y: 14, color: WHITE } : false}
              animate={{ opacity: 1, y: 0, color: ch === 'A' ? GOLD : WHITE }}
              transition={{
                opacity: { delay: animated ? 0.25 + i * 0.06 : 0, duration: 0.4 },
                y: { delay: animated ? 0.25 + i * 0.06 : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                color: { delay: animated ? 1.0 + i * 0.03 : 0, duration: 0.5 },
              }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      </div>
      {tagline && s.tag > 0 && (
        <motion.div
          className="mt-4 text-muted"
          style={{ fontSize: s.tag, letterSpacing: '0.42em', paddingLeft: '0.42em' }}
          initial={animated ? { opacity: 0, y: 6, letterSpacing: '0.2em' } : false}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.42em' }}
          transition={{ delay: animated ? 1.25 : 0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          YOUR STORE. YOUR BRAND.
        </motion.div>
      )}
    </div>
  )
}

/** Compact square mark used in sidebars and favicons */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-[10px] gold-gradient font-display font-bold text-gold-ink"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      B
    </div>
  )
}
