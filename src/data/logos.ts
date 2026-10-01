import type { LogoOption } from './types'

/**
 * Logo concepts offered during onboarding. Each one carries the palette that the
 * simulated "brand engine" uses to generate the storefront theme.
 */
export const LOGOS: LogoOption[] = [
  {
    id: 'aurum',
    name: 'Aurum',
    description: 'Gold monogram ring — timeless and premium.',
    shape: 'ring',
    font: 'serif',
    paletteName: 'Gold & Onyx',
    palette: { primary: '#E8B948', secondary: '#B9832A', dark: '#0B0B10', light: '#FBF6EA' },
  },
  {
    id: 'prism',
    name: 'Prism',
    description: 'Faceted diamond in electric violet.',
    shape: 'prism',
    font: 'display',
    paletteName: 'Violet Night',
    palette: { primary: '#8B5CF6', secondary: '#C084FC', dark: '#0E0A1A', light: '#F6F2FF' },
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Hexagonal badge with energetic red.',
    shape: 'hex',
    font: 'heavy',
    paletteName: 'Ember Red',
    palette: { primary: '#E5484D', secondary: '#FF8A65', dark: '#140B0C', light: '#FFF4F2' },
  },
  {
    id: 'verdant',
    name: 'Verdant',
    description: 'Organic leaf mark in emerald green.',
    shape: 'leaf',
    font: 'sans',
    paletteName: 'Emerald Leaf',
    palette: { primary: '#10B981', secondary: '#6EE7B7', dark: '#07130F', light: '#F1FBF6' },
  },
  {
    id: 'tidal',
    name: 'Tidal',
    description: 'Split wave emblem in ocean blue.',
    shape: 'wave',
    font: 'display',
    paletteName: 'Ocean Blue',
    palette: { primary: '#38BDF8', secondary: '#2563EB', dark: '#06101C', light: '#F0F8FF' },
  },
  {
    id: 'rose',
    name: 'Rosé',
    description: 'Soft arch with an elegant blush tone.',
    shape: 'arch',
    font: 'serif',
    paletteName: 'Blush Rosé',
    palette: { primary: '#E879A6', secondary: '#F9A8D4', dark: '#170C12', light: '#FFF5F9' },
  },
]

export const getLogo = (id: string) => LOGOS.find((l) => l.id === id) ?? LOGOS[0]
