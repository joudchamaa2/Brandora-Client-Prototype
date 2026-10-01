import type { ButtonShape, FontKey, HeroStyle, LogoOption, ThemeOption } from '../data/types'
import { alpha, mix, readableOn } from './color'

/**
 * Brandora "brand engine" (simulated).
 *
 * Combines the palette extracted from the chosen logo with the layout rules of the
 * chosen theme to produce a complete storefront design system. No AI involved —
 * every logo ships with a predefined palette and every theme with layout rules.
 */

export const FONT_STACKS: Record<FontKey, string> = {
  serif: "'Playfair Display Variable', 'Playfair Display', Georgia, serif",
  display: "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif",
  sans: "'Inter Variable', 'Inter', system-ui, sans-serif",
  heavy: "'Archivo Black', 'Space Grotesk Variable', Impact, sans-serif",
}

export interface BuilderSettings {
  /** Overrides the primary color extracted from the logo */
  primary?: string
  headingFont?: FontKey
  buttonShape?: ButtonShape
  heroStyle?: HeroStyle
  heroTitle: string
  heroSubtitle: string
  heroCta: string
  announcement: string
  featuredCount: number
  showCategories: boolean
  showPromo: boolean
}

export const DEFAULT_BUILDER: BuilderSettings = {
  heroTitle: 'New season. New rules.',
  heroSubtitle: 'Premium streetwear essentials, designed in Beirut and delivered to your door.',
  heroCta: 'Shop the collection',
  announcement: 'Free delivery on orders over $75',
  featuredCount: 4,
  showCategories: true,
  showPromo: true,
}

export interface StoreTheme {
  key: string
  mode: 'dark' | 'light'
  bg: string
  surface: string
  surface2: string
  text: string
  muted: string
  border: string
  primary: string
  primarySoft: string
  onPrimary: string
  secondary: string
  heroBg: string
  heroText: string
  headingFont: string
  bodyFont: string
  headingWeight: number
  uppercase: boolean
  tracking: string
  radius: number
  buttonRadius: number
  heroStyle: HeroStyle
  cardStyle: ThemeOption['cardStyle']
  cardShadow: string
}

const BUTTON_RADIUS: Record<ButtonShape, number> = { square: 2, rounded: 10, pill: 999 }

export function buildStoreTheme(
  logo: LogoOption,
  theme: ThemeOption,
  overrides: Partial<BuilderSettings> = {},
): StoreTheme {
  const p = logo.palette
  const primary = overrides.primary ?? p.primary
  const secondary = p.secondary
  const fontKey = overrides.headingFont ?? theme.headingFont
  const heroStyle = overrides.heroStyle ?? theme.heroStyle
  const buttonShape = overrides.buttonShape ?? theme.buttonShape

  const dark = theme.mode === 'dark'

  // Backgrounds are tinted by the logo palette so each logo yields a unique store.
  const bg = dark ? mix(p.dark, '#000000', theme.id === 'luxury' ? 0.25 : 0) : mix(p.light, '#ffffff', theme.id === 'minimal' ? 0.55 : 0.15)
  const surface = dark ? mix(bg, primary, 0.06) : '#ffffff'
  const surface2 = dark ? mix(bg, primary, 0.12) : mix(p.light, primary, 0.08)
  const text = dark ? '#F6F4EF' : mix(p.dark, '#000000', 0.2)
  const muted = dark ? alpha('#F6F4EF', 0.6) : alpha(mix(p.dark, '#000000', 0.2), 0.6)
  const border = dark ? alpha(primary, 0.18) : alpha(mix(p.dark, primary, 0.3), 0.12)

  let heroBg = dark ? mix(bg, primary, 0.1) : surface2
  let heroText = text
  if (theme.id === 'bold') {
    heroBg = primary
    heroText = readableOn(primary, mix(p.dark, '#000000', 0.3))
  }
  if (theme.id === 'fashion') {
    heroBg = mix(p.light, primary, 0.14)
  }

  return {
    key: `${logo.id}-${theme.id}-${primary}-${fontKey}-${buttonShape}-${heroStyle}`,
    mode: theme.mode,
    bg,
    surface,
    surface2,
    text,
    muted,
    border,
    primary,
    primarySoft: alpha(primary, dark ? 0.16 : 0.12),
    onPrimary: readableOn(primary, mix(p.dark, '#000000', 0.4)),
    secondary,
    heroBg,
    heroText,
    headingFont: FONT_STACKS[fontKey],
    bodyFont: FONT_STACKS.sans,
    headingWeight: fontKey === 'heavy' ? 400 : fontKey === 'serif' ? 600 : 700,
    uppercase: theme.uppercase,
    tracking: theme.uppercase ? '0.08em' : fontKey === 'serif' ? '-0.01em' : '-0.02em',
    radius: theme.radius,
    buttonRadius: BUTTON_RADIUS[buttonShape],
    heroStyle,
    cardStyle: theme.cardStyle,
    cardShadow:
      theme.cardStyle === 'elevated'
        ? dark
          ? `0 18px 40px -20px ${alpha(primary, 0.45)}`
          : '0 14px 30px -18px rgba(15, 15, 30, 0.35)'
        : 'none',
  }
}

/** Swatches shown in the generator / builder ("extracted" from the logo) */
export function paletteSwatches(logo: LogoOption) {
  const p = logo.palette
  return [
    { label: 'Primary', hex: p.primary },
    { label: 'Secondary', hex: p.secondary },
    { label: 'Ink', hex: p.dark },
    { label: 'Canvas', hex: p.light },
    { label: 'Tint', hex: mix(p.primary, p.light, 0.6) },
  ]
}
