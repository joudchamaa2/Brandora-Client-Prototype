import { useId } from 'react'
import type { LogoOption } from '../../data/types'
import { mix } from '../../lib/color'
import { FONT_STACKS } from '../../lib/storeTheme'
import { cn } from '../../lib/utils'

interface MarkProps {
  logo: LogoOption
  name: string
  size?: number
  /** Overrides the logo's primary color (website builder) */
  primary?: string
}

/** The symbol part of a generated brand logo */
export function LogoSymbol({ logo, name, size = 48, primary }: MarkProps) {
  const uid = useId().replace(/:/g, '')
  const p = { ...logo.palette, primary: primary ?? logo.palette.primary }
  const letter = (name.trim()[0] ?? 'B').toUpperCase()
  const font = FONT_STACKS[logo.font]
  const grad = `lg-${uid}`

  const text = (fill: string, fontSize = 28, extra: Record<string, string | number> = {}) => (
    <text
      x="32"
      y="33"
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={font}
      fontSize={fontSize}
      fontWeight={logo.font === 'heavy' ? 400 : 700}
      fill={fill}
      {...extra}
    >
      {letter}
    </text>
  )

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={mix(p.primary, '#ffffff', 0.15)} />
          <stop offset="1" stopColor={p.secondary} />
        </linearGradient>
      </defs>

      {logo.shape === 'ring' && (
        <>
          <circle cx="32" cy="32" r="30" fill={p.dark} />
          <circle cx="32" cy="32" r="27" fill="none" stroke={`url(#${grad})`} strokeWidth="2.5" />
          <circle cx="32" cy="32" r="22.5" fill="none" stroke={p.primary} strokeOpacity="0.45" strokeWidth="0.8" />
          {text(p.primary, 27)}
        </>
      )}

      {logo.shape === 'prism' && (
        <>
          <polygon points="32,3 61,32 32,61 3,32" fill={`url(#${grad})`} />
          <polygon points="32,3 61,32 32,32" fill="#ffffff" fillOpacity="0.14" />
          <polygon points="3,32 32,61 32,32" fill="#000000" fillOpacity="0.12" />
          {text('#ffffff', 24)}
        </>
      )}

      {logo.shape === 'hex' && (
        <>
          <polygon points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5" fill={p.dark} stroke={p.primary} strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="32,11 50,21.5 50,42.5 32,53 14,42.5 14,21.5" fill={p.primary} fillOpacity="0.14" />
          {text(p.primary, 24)}
        </>
      )}

      {logo.shape === 'leaf' && (
        <>
          <path d="M32 4 C54 12 60 36 46 54 C40 61 24 61 18 54 C4 36 10 12 32 4 Z" fill={`url(#${grad})`} />
          <path d="M32 10 L32 58" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.2" />
          {text('#ffffff', 24, { y: 36 })}
        </>
      )}

      {logo.shape === 'wave' && (
        <>
          <clipPath id={`c-${uid}`}>
            <circle cx="32" cy="32" r="29" />
          </clipPath>
          <g clipPath={`url(#c-${uid})`}>
            <rect width="64" height="64" fill={p.primary} />
            <path d="M0 38 C12 30 22 46 34 38 C46 30 54 44 64 36 L64 64 L0 64 Z" fill={p.secondary} />
            <path d="M0 46 C12 40 22 54 34 46 C46 38 54 52 64 44 L64 64 L0 64 Z" fill={p.dark} fillOpacity="0.35" />
          </g>
          {text('#ffffff', 24, { y: 27 })}
        </>
      )}

      {logo.shape === 'arch' && (
        <>
          <path d="M10 60 L10 30 A22 22 0 0 1 54 30 L54 60 Z" fill={`url(#${grad})`} />
          <path d="M17 60 L17 31 A15 15 0 0 1 47 31 L47 60" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
          {text(p.dark, 26, { fontStyle: 'italic', y: 40 })}
        </>
      )}
    </svg>
  )
}

interface LogoProps extends MarkProps {
  /** Background the logo sits on — controls the wordmark color */
  on?: 'dark' | 'light'
  layout?: 'horizontal' | 'stacked'
  className?: string
}

/** Full logo lock-up: symbol + store-name wordmark */
export function LogoMark({ logo, name, size = 40, primary, on = 'dark', layout = 'horizontal', className }: LogoProps) {
  const upper = logo.font === 'serif' || logo.font === 'heavy'
  return (
    <div className={cn('flex items-center', layout === 'stacked' ? 'flex-col gap-2 text-center' : 'gap-3', className)}>
      <LogoSymbol logo={logo} name={name} size={size} primary={primary} />
      <span
        className="leading-tight"
        style={{
          fontFamily: FONT_STACKS[logo.font],
          fontWeight: logo.font === 'heavy' ? 400 : 700,
          fontSize: size * (layout === 'stacked' ? 0.36 : 0.42),
          letterSpacing: upper ? '0.12em' : '-0.01em',
          textTransform: upper ? 'uppercase' : 'none',
          color: on === 'dark' ? '#F6F4EF' : mix(logo.palette.dark, '#000000', 0.2),
        }}
      >
        {name}
      </span>
    </div>
  )
}
