import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { ADMIN_ORDERS } from '../data/adminOrders'
import { DELIVERY_FEE, DRIVERS, SEED_ORDERS, STAGE_SECONDS } from '../data/orders'
import { getProduct } from '../data/products'
import type { CartItem, CategoryKey, Order, OrderStage } from '../data/types'
import { usePersistentState } from '../lib/usePersistentState'

export type HomeFilter = 'all' | 'featured' | 'wholesale'

interface CustomerApi {
  category: CategoryKey
  setCategory: (c: CategoryKey) => void
  homeFilter: HomeFilter
  setHomeFilter: (f: HomeFilter) => void

  cart: CartItem[]
  cartCount: number
  subtotal: number
  deliveryFee: number
  addToCart: (item: Omit<CartItem, 'key'>) => void
  updateQty: (key: string, delta: number) => void
  removeFromCart: (key: string) => void

  favorites: string[]
  isFavorite: (storeId: string) => boolean
  toggleFavorite: (storeId: string) => boolean

  orders: Order[]
  placeOrder: (address: string) => Order[]
  rateOrder: (id: string, rating: number) => void
  setOrderStage: (id: string, stage: OrderStage) => void

  signedIn: boolean
  setSignedIn: (v: boolean) => void

  recentSearches: string[]
  addRecentSearch: (q: string) => void
  clearRecentSearches: () => void
}

const CustomerContext = createContext<CustomerApi | null>(null)

/** Current tracking stage for an order (live orders advance with time) */
export function orderStage(order: Order, now: number): OrderStage {
  if (order.fixedStage !== undefined) return order.fixedStage
  const elapsed = (now - order.placedAt) / 1000
  let stage = 0
  STAGE_SECONDS.forEach((t, i) => {
    if (elapsed >= t) stage = i
  })
  return stage as OrderStage
}

const idNumber = (id: string) => Number(id.replace(/\D/g, '')) || 0

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = usePersistentState<CategoryKey>('category', 'fashion')
  const [homeFilter, setHomeFilter] = usePersistentState<HomeFilter>('homeFilter', 'all')
  const [cart, setCart] = usePersistentState<CartItem[]>('cart', [])
  const [favorites, setFavorites] = usePersistentState<string[]>('favorites', [])
  const [orders, setOrders] = usePersistentState<Order[]>('orders', SEED_ORDERS)
  const [signedIn, setSignedIn] = usePersistentState<boolean>('signedIn', true)
  const [recentSearches, setRecent] = usePersistentState<string[]>('recentSearches', ['Bomber jacket', 'Luxe Atelier', 'Earbuds'])

  const addToCart = useCallback<CustomerApi['addToCart']>(
    (item) => {
      setCart((prev) => {
        const key = `${item.productId}|${item.size ?? ''}|${item.color ?? ''}|${item.mode}`
        const existing = prev.find((i) => i.key === key)
        if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i))
        return [...prev, { ...item, key }]
      })
    },
    [setCart],
  )

  const updateQty = useCallback(
    (key: string, delta: number) =>
      setCart((prev) =>
        prev.map((i) => {
          if (i.key !== key) return i
          const min = i.mode === 'wholesale' ? (getProduct(i.productId)?.minWholesale ?? 1) : 1
          return { ...i, qty: Math.max(min, i.qty + delta) }
        }),
      ),
    [setCart],
  )

  const removeFromCart = useCallback((key: string) => setCart((prev) => prev.filter((i) => i.key !== key)), [setCart])

  const toggleFavorite = useCallback(
    (storeId: string) => {
      const willAdd = !favorites.includes(storeId)
      setFavorites((prev) => (prev.includes(storeId) ? prev.filter((f) => f !== storeId) : [...prev, storeId]))
      return willAdd
    },
    [favorites, setFavorites],
  )

  const placeOrder = useCallback(
    (address: string) => {
      const byStore = new Map<string, CartItem[]>()
      cart.forEach((i) => byStore.set(i.storeId, [...(byStore.get(i.storeId) ?? []), i]))

      let next = Math.max(...orders.map((o) => idNumber(o.id)), ...ADMIN_ORDERS.map((o) => idNumber(o.id))) + 1
      const created: Order[] = [...byStore.entries()].map(([storeId, items], idx) => {
        const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)
        return {
          id: `BR-${next++}`,
          storeId,
          items: items.map((i) => ({
            productId: i.productId,
            name: getProduct(i.productId)?.name ?? 'Product',
            size: i.size,
            color: i.color,
            qty: i.qty,
            unitPrice: i.unitPrice,
            mode: i.mode,
          })),
          subtotal,
          delivery: DELIVERY_FEE,
          total: subtotal + DELIVERY_FEE,
          address,
          payment: 'cod',
          placedAt: Date.now(),
          driver: DRIVERS[idx % DRIVERS.length],
        }
      })
      setOrders((prev) => [...created, ...prev])
      setCart([])
      return created
    },
    [cart, orders, setCart, setOrders],
  )

  const rateOrder = useCallback(
    (id: string, rating: number) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, rating } : o))),
    [setOrders],
  )

  const setOrderStage = useCallback(
    (id: string, stage: OrderStage) =>
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o
          // Re-anchor live orders so they continue animating from the chosen stage
          if (stage < 4) return { ...o, fixedStage: undefined, placedAt: Date.now() - STAGE_SECONDS[stage] * 1000 }
          return { ...o, fixedStage: stage }
        }),
      ),
    [setOrders],
  )

  const addRecentSearch = useCallback(
    (q: string) => {
      const term = q.trim()
      if (!term) return
      setRecent((prev) => [term, ...prev.filter((p) => p.toLowerCase() !== term.toLowerCase())].slice(0, 6))
    },
    [setRecent],
  )

  const value = useMemo<CustomerApi>(() => {
    const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0)
    const storeCount = new Set(cart.map((i) => i.storeId)).size
    return {
      category,
      setCategory,
      homeFilter,
      setHomeFilter,
      cart,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      subtotal,
      deliveryFee: storeCount * DELIVERY_FEE,
      addToCart,
      updateQty,
      removeFromCart,
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      orders,
      placeOrder,
      rateOrder,
      setOrderStage,
      signedIn,
      setSignedIn,
      recentSearches,
      addRecentSearch,
      clearRecentSearches: () => setRecent([]),
    }
  }, [
    category,
    setCategory,
    homeFilter,
    setHomeFilter,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    favorites,
    toggleFavorite,
    orders,
    placeOrder,
    rateOrder,
    setOrderStage,
    signedIn,
    setSignedIn,
    recentSearches,
    addRecentSearch,
    setRecent,
  ])

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export function useCustomer() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider')
  return ctx
}
