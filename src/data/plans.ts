import type { Plan } from './types'

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 25,
    tagline: 'Everything you need to open your doors.',
    features: ['Up to 50 products', 'Basic store', 'Basic analytics', 'Store customization', 'Cash on delivery orders'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 50,
    tagline: 'For growing brands ready to scale.',
    features: ['Unlimited products', 'Advanced analytics', 'Advanced customization', 'Offers & promotions', 'Wholesale pricing'],
    highlight: 'Most popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 80,
    tagline: 'Professional tools for established stores.',
    features: ['Everything in Growth', 'Advanced analytics', 'Priority support', 'Advanced store tools', 'Staff management'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100,
    tagline: 'The complete Brandora business suite.',
    features: ['Full business tools', 'Advanced management', 'Priority support', 'Premium customization', 'Dedicated success manager'],
  },
]

export const getPlan = (id: string) => PLANS.find((p) => p.id === id) ?? PLANS[1]

export const PAYMENT_HISTORY = [
  { id: 'INV-2026-010', date: 'Oct 1, 2026', amount: 50, method: 'Whish Money', status: 'Paid' },
  { id: 'INV-2026-009', date: 'Sep 1, 2026', amount: 50, method: 'Whish Money', status: 'Paid' },
  { id: 'INV-2026-008', date: 'Aug 1, 2026', amount: 50, method: 'Whish Money', status: 'Paid' },
  { id: 'INV-2026-007', date: 'Jul 1, 2026', amount: 25, method: 'Whish Money', status: 'Paid' },
  { id: 'INV-2026-006', date: 'Jun 1, 2026', amount: 25, method: 'Whish Money', status: 'Paid' },
]
