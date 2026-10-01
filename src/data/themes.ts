import type { ThemeOption } from './types'

export const THEMES: ThemeOption[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Dark, refined and editorial with serif headlines.',
    mode: 'dark',
    headingFont: 'serif',
    heroStyle: 'centered',
    buttonShape: 'square',
    radius: 4,
    uppercase: true,
    cardStyle: 'bordered',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Airy light layout that lets products breathe.',
    mode: 'light',
    headingFont: 'sans',
    heroStyle: 'split',
    buttonShape: 'rounded',
    radius: 10,
    uppercase: false,
    cardStyle: 'flat',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Tech-forward dark UI with soft glowing accents.',
    mode: 'dark',
    headingFont: 'display',
    heroStyle: 'split',
    buttonShape: 'rounded',
    radius: 16,
    uppercase: false,
    cardStyle: 'elevated',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Magazine-style hero with oversized type.',
    mode: 'light',
    headingFont: 'serif',
    heroStyle: 'editorial',
    buttonShape: 'pill',
    radius: 0,
    uppercase: false,
    cardStyle: 'flat',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-contrast color blocks that demand attention.',
    mode: 'light',
    headingFont: 'heavy',
    heroStyle: 'banner',
    buttonShape: 'pill',
    radius: 20,
    uppercase: true,
    cardStyle: 'elevated',
  },
]

export const getTheme = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0]

export const FONT_LABELS = {
  serif: 'Playfair (Serif)',
  display: 'Space Grotesk',
  sans: 'Inter',
  heavy: 'Archivo Black',
} as const
