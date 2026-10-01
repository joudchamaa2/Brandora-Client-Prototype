import type { Order } from './types'

const HOUR = 60 * 60 * 1000

export const DRIVERS = [
  { name: 'Karim M.', rating: 4.9 },
  { name: 'Hadi S.', rating: 4.8 },
  { name: 'Rami K.', rating: 4.9 },
]

export const TRACKING_STEPS = [
  { label: 'Order accepted', hint: 'The store confirmed your order' },
  { label: 'Item picked up', hint: 'Your driver collected the package' },
  { label: 'Processing', hint: 'Quality check & packaging' },
  { label: 'Out for delivery', hint: 'On the way to your address' },
  { label: 'Delivered', hint: 'Enjoy your purchase!' },
] as const

/**
 * Seconds after placement at which each tracking stage is reached for orders placed
 * during the demo (accepted → picked up → processing → out for delivery → delivered).
 */
export const STAGE_SECONDS = [0, 4, 8, 13, 30] as const

/** Seed orders shown before the presenter places a new one */
export const SEED_ORDERS: Order[] = [
  {
    id: 'BR-34859',
    storeId: 'nova',
    items: [
      { productId: 'nova-bomber', name: 'Oversized Bomber Jacket', size: 'S', color: 'Black', qty: 1, unitPrice: 89, mode: 'retail' },
    ],
    subtotal: 89,
    delivery: 3,
    total: 92,
    address: 'Bliss Street, Hamra, Beirut',
    payment: 'cod',
    placedAt: Date.now() - 26 * HOUR,
    fixedStage: 4,
    driver: DRIVERS[0],
  },
  {
    id: 'BR-34860',
    storeId: 'luxe',
    items: [{ productId: 'luxe-scarf', name: 'Cashmere Scarf', color: 'Sand', qty: 1, unitPrice: 117, mode: 'retail' }],
    subtotal: 117,
    delivery: 3,
    total: 120,
    address: 'Bliss Street, Hamra, Beirut',
    payment: 'cod',
    placedAt: Date.now() - 2 * HOUR,
    fixedStage: 2,
    driver: DRIVERS[1],
  },
]

export const DELIVERY_FEE = 3
