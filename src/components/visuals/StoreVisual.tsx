import { Gem, Home, Leaf, Shirt, Smartphone, Sparkles, type LucideIcon } from 'lucide-react'
import type { Store, StoreIcon } from '../../data/types'
import { alpha } from '../../lib/color'
import { cn, initials } from '../../lib/utils'

export const STORE_ICONS: Record<StoreIcon, LucideIcon> = {
  shirt: Shirt,
  gem: Gem,
  leaf: Leaf,
  smartphone: Smartphone,
  sparkles: Sparkles,
  home: Home,
}

/** Generated store cover — gradient + pattern + category icon (no external images) */
export function StoreCover({
  store,
  className,
  iconSize = 32,
  pattern = true,
}: {
  store: Store
  className?: string
  iconSize?: number
  pattern?: boolean
}) {
  const Icon = STORE_ICONS[store.icon]
  return (
    <div
      className={cn('relative grid place-items-center overflow-hidden border border-line', className)}
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, ${alpha(store.accent, 0.16)}, transparent 60%), linear-gradient(150deg, #18244a 0%, #0d142a 100%)`,
      }}
    >
      {pattern && (
        <svg className="absolute inset-0 size-full opacity-[0.22]" aria-hidden>
          <defs>
            <pattern id={`p-${store.id}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="22" stroke={alpha(store.accent, 0.35)} strokeWidth="1" />
            </pattern>
            <radialGradient id={`m-${store.id}`}>
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id={`mask-${store.id}`}>
              <rect width="100%" height="100%" fill={`url(#m-${store.id})`} />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p-${store.id})`} mask={`url(#mask-${store.id})`} />
        </svg>
      )}
      <Icon className="relative text-gold" style={{ width: iconSize, height: iconSize }} strokeWidth={1.5} />
    </div>
  )
}

/** Circular store logo with monogram */
export function StoreLogo({ store, size = 56, className }: { store: Store; size?: number; className?: string }) {
  return (
    <div
      className={cn('grid shrink-0 place-items-center rounded-2xl border-2 font-display font-bold', className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        borderColor: '#080C18',
        color: store.accent,
        background: `linear-gradient(145deg, #1c2848, #0d142a)`,
        boxShadow: `0 0 0 1px ${alpha(store.accent, 0.4)}, 0 10px 24px -10px rgba(0,0,0,0.8)`,
      }}
    >
      {initials(store.name)}
    </div>
  )
}
