import { motion } from 'framer-motion'
import {
  BedDouble,
  Droplet,
  Flame,
  Flower2,
  Headphones,
  Lamp,
  Palette,
  PlugZap,
  Speaker,
  SprayCan,
  Watch,
  type LucideIcon,
} from 'lucide-react'
import { useId } from 'react'
import type { ProductKind } from '../../data/types'
import { alpha, mix } from '../../lib/color'
import { cn } from '../../lib/utils'

/* Garment silhouettes drawn on a 100×100 grid */
const GARMENTS: Partial<Record<ProductKind, { body: string; details: string[] }>> = {
  tee: {
    body: 'M34 16 L42 13 C44 18 56 18 58 13 L66 16 L84 30 L76 42 L68 37 L68 86 L32 86 L32 37 L24 42 L16 30 Z',
    details: ['M42 13 C44 18 56 18 58 13', 'M40 46 L60 46 L60 58 L40 58 Z'],
  },
  jacket: {
    body: 'M33 15 L43 12 C45 17 55 17 57 12 L67 15 L80 24 L88 66 L78 69 L70 40 L70 84 L30 84 L30 40 L22 69 L12 66 L20 24 Z',
    details: ['M50 17 L50 84', 'M30 78 L70 78', 'M13 61 L23 64', 'M87 61 L77 64', 'M36 52 L42 60', 'M64 52 L58 60'],
  },
  hoodie: {
    body: 'M33 17 L41 13 C40 3 60 3 59 13 L67 17 L80 26 L88 68 L78 71 L70 42 L70 86 L30 86 L30 42 L22 71 L12 68 L20 26 Z',
    details: ['M41 13 C44 21 56 21 59 13', 'M46 19 L45 32', 'M54 19 L55 32', 'M38 62 L62 62 L66 76 L34 76 Z', 'M30 80 L70 80'],
  },
  pants: {
    body: 'M32 12 L68 12 L72 88 L55 88 L50 36 L45 88 L28 88 Z',
    details: ['M32 18 L68 18', 'M29 50 L40 50 L40 64 L29 64', 'M71 50 L60 50 L60 64 L71 64', 'M50 18 L50 34'],
  },
  trousers: {
    body: 'M30 12 L70 12 L80 88 L56 88 L50 34 L44 88 L20 88 Z',
    details: ['M30 18 L70 18', 'M40 18 L38 40', 'M60 18 L62 40'],
  },
  dress: {
    body: 'M41 10 L59 10 L58 24 L64 36 L82 88 L18 88 L36 36 L42 24 Z',
    details: ['M36 36 L64 36', 'M50 36 L44 48', 'M50 36 L56 48'],
  },
  blazer: {
    body: 'M33 15 L43 12 L50 18 L57 12 L67 15 L80 24 L86 70 L77 72 L70 42 L70 86 L30 86 L30 42 L23 72 L14 70 L20 24 Z',
    details: ['M43 12 L50 46 L57 12', 'M43 12 L38 30 L45 34', 'M57 12 L62 30 L55 34', 'M36 62 L44 62', 'M56 62 L64 62'],
  },
  shirt: {
    body: 'M34 15 L43 12 L50 17 L57 12 L66 15 L79 24 L86 70 L77 72 L69 40 L69 86 L31 86 L31 40 L23 72 L14 70 L21 24 Z',
    details: ['M43 12 L46 22 L50 17 L54 22 L57 12', 'M50 22 L50 86'],
  },
  scarf: {
    body: 'M34 10 L58 10 L60 66 L48 90 L40 90 L45 66 Z',
    details: ['M58 10 L68 13 L72 58 L62 60', 'M42 90 L41 94', 'M45 90 L44 94', 'M48 90 L47 94', 'M37 30 L58 30', 'M37 46 L59 46'],
  },
}

const ICONS: Partial<Record<ProductKind, LucideIcon>> = {
  earbuds: Headphones,
  charger: PlugZap,
  watch: Watch,
  speaker: Speaker,
  serum: Droplet,
  lipstick: Palette,
  perfume: SprayCan,
  vase: Flower2,
  blanket: BedDouble,
  candle: Flame,
  lamp: Lamp,
}

interface Props {
  kind: ProductKind
  color: string
  className?: string
  /** Visual scale of the artwork inside its container */
  scale?: number
  rounded?: string
  /** Renders without the studio background (for compact table thumbnails) */
  bare?: boolean
  /** Custom backdrop (storefront previews use theme colors) */
  background?: string
  /** Color of the highlighted seam/detail line and icons */
  accent?: string
}

/** Generated product imagery — works offline, no external image URLs */
export function ProductArt({
  kind,
  color,
  className,
  scale = 0.62,
  rounded = 'rounded-2xl',
  bare,
  background,
  accent = '#E8B948',
}: Props) {
  const uid = useId().replace(/:/g, '')
  const garment = GARMENTS[kind]
  const Icon = ICONS[kind]

  return (
    <div
      className={cn('relative grid place-items-center overflow-hidden', !bare && !background && 'border border-line', rounded, className)}
      style={
        bare
          ? undefined
          : {
              background: `radial-gradient(circle at 50% 38%, ${alpha(color, 0.28)}, transparent 62%), ${
                background ?? 'linear-gradient(160deg, #18244a 0%, #0d142a 100%)'
              }`,
            }
      }
    >
      {!bare && (
        <div
          className="pointer-events-none absolute inset-x-[22%] bottom-[10%] h-[8%] rounded-[50%] blur-md"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        />
      )}
      {garment ? (
        <motion.svg
          key={color}
          initial={{ opacity: 0.4, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          viewBox="0 0 100 100"
          className="relative"
          style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
          aria-hidden
        >
          <defs>
            <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={mix(color, '#ffffff', 0.18)} />
              <stop offset="1" stopColor={mix(color, '#000000', 0.25)} />
            </linearGradient>
          </defs>
          <path d={garment.body} fill={`url(#g-${uid})`} stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinejoin="round" />
          {garment.details.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={i === 0 ? alpha(accent, 0.8) : 'rgba(255,255,255,0.18)'}
              strokeWidth={i === 0 ? 1.4 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </motion.svg>
      ) : Icon ? (
        <Icon className="relative" color={accent} style={{ width: `${scale * 60}%`, height: `${scale * 60}%` }} strokeWidth={1.4} />
      ) : null}
    </div>
  )
}
