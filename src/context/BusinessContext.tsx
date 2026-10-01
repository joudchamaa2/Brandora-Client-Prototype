import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { ADMIN_ORDERS } from '../data/adminOrders'
import { ADMIN_PRODUCTS } from '../data/adminProducts'
import { getLogo } from '../data/logos'
import { OFFERS } from '../data/offers'
import { getPlan } from '../data/plans'
import { STAFF } from '../data/staff'
import { getTheme } from '../data/themes'
import type {
  AdminOrder,
  AdminOrderStatus,
  AdminProduct,
  LogoOption,
  Offer,
  Plan,
  PlanId,
  StaffMember,
  ThemeId,
  ThemeOption,
} from '../data/types'
import { buildStoreTheme, DEFAULT_BUILDER, type BuilderSettings, type StoreTheme } from '../lib/storeTheme'
import { usePersistentState } from '../lib/usePersistentState'
import { orderStage, useCustomer } from './CustomerContext'

const STAGE_TO_STATUS: AdminOrderStatus[] = ['Accepted', 'Processing', 'Processing', 'Out for delivery', 'Delivered']

export interface BusinessProfile {
  storeName: string
  category: string
  businessType: 'Retail' | 'Wholesale' | 'Retail + Wholesale'
}

interface BusinessApi {
  profile: BusinessProfile
  setProfile: (p: BusinessProfile) => void

  planId: PlanId
  plan: Plan
  setPlanId: (id: PlanId) => void
  paid: boolean
  setPaid: (v: boolean) => void

  logoId: string
  logo: LogoOption
  setLogoId: (id: string) => void
  themeId: ThemeId
  themeOption: ThemeOption
  setThemeId: (id: ThemeId) => void
  generated: boolean
  setGenerated: (v: boolean) => void
  submitted: boolean
  setSubmitted: (v: boolean) => void

  builder: BuilderSettings
  updateBuilder: (patch: Partial<BuilderSettings>) => void
  resetBuilder: () => void
  storeTheme: StoreTheme

  products: AdminProduct[]
  addProduct: (p: Omit<AdminProduct, 'id' | 'sales' | 'sku'>) => void
  adjustStock: (id: string, delta: number) => void

  adminOrders: AdminOrder[]
  setOrderStatus: (id: string, status: AdminOrderStatus) => void

  staff: StaffMember[]
  addStaff: (m: Omit<StaffMember, 'id' | 'lastActive' | 'color'>) => void

  offers: Offer[]
  addOffer: (o: Omit<Offer, 'id' | 'redemptions' | 'revenue'>) => void
  toggleOffer: (id: string) => void
}

const BusinessContext = createContext<BusinessApi | null>(null)

const STAFF_COLORS = ['#F59E0B', '#22D3EE', '#F472B6', '#34D399', '#A78BFA', '#60A5FA']

export function BusinessProvider({ children }: { children: ReactNode }) {
  const customer = useCustomer()

  const [profile, setProfile] = usePersistentState<BusinessProfile>('biz:profile', {
    storeName: 'Nova Streetwear',
    category: 'Clothing & Fashion',
    businessType: 'Retail + Wholesale',
  })
  const [planId, setPlanId] = usePersistentState<PlanId>('biz:plan', 'growth')
  const [paid, setPaid] = usePersistentState('biz:paid', false)
  const [logoId, setLogoIdRaw] = usePersistentState('biz:logo', 'aurum')
  const [themeId, setThemeIdRaw] = usePersistentState<ThemeId>('biz:theme', 'luxury')
  const [generated, setGenerated] = usePersistentState('biz:generated', false)
  const [submitted, setSubmitted] = usePersistentState('biz:submitted', false)
  const [builder, setBuilder] = usePersistentState<BuilderSettings>('biz:builder', DEFAULT_BUILDER)
  const [products, setProducts] = usePersistentState<AdminProduct[]>('biz:products', ADMIN_PRODUCTS)
  const [statusOverrides, setStatusOverrides] = usePersistentState<Record<string, AdminOrderStatus>>('biz:orderStatus', {})
  const [staff, setStaff] = usePersistentState<StaffMember[]>('biz:staff', STAFF)
  const [offers, setOffers] = usePersistentState<Offer[]>('biz:offers', OFFERS)

  const setLogoId = useCallback(
    (id: string) => {
      setLogoIdRaw(id)
      // A new logo means a new extracted palette — drop any manual color override.
      setBuilder((b) => ({ ...b, primary: undefined }))
    },
    [setLogoIdRaw, setBuilder],
  )

  const setThemeId = useCallback(
    (id: ThemeId) => {
      setThemeIdRaw(id)
      // A theme brings its own layout, type and button style.
      setBuilder((b) => ({ ...b, heroStyle: undefined, headingFont: undefined, buttonShape: undefined }))
    },
    [setThemeIdRaw, setBuilder],
  )

  const updateBuilder = useCallback((patch: Partial<BuilderSettings>) => setBuilder((b) => ({ ...b, ...patch })), [setBuilder])

  const addProduct = useCallback<BusinessApi['addProduct']>(
    (p) =>
      setProducts((prev) => [
        {
          ...p,
          id: `ap-${Date.now()}`,
          sales: 0,
          sku: `NOV-${p.name.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase().padEnd(3, 'X')}-${String(prev.length + 1).padStart(3, '0')}`,
        },
        ...prev,
      ]),
    [setProducts],
  )

  const adjustStock = useCallback(
    (id: string, delta: number) =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))),
    [setProducts],
  )

  const setOrderStatus = useCallback(
    (id: string, status: AdminOrderStatus) => setStatusOverrides((prev) => ({ ...prev, [id]: status })),
    [setStatusOverrides],
  )

  const addStaff = useCallback<BusinessApi['addStaff']>(
    (m) =>
      setStaff((prev) => [
        ...prev,
        { ...m, id: `st-${Date.now()}`, lastActive: '—', color: STAFF_COLORS[prev.length % STAFF_COLORS.length] },
      ]),
    [setStaff],
  )

  const addOffer = useCallback<BusinessApi['addOffer']>(
    (o) => setOffers((prev) => [{ ...o, id: `of-${Date.now()}`, redemptions: 0, revenue: 0 }, ...prev]),
    [setOffers],
  )

  const toggleOffer = useCallback(
    (id: string) =>
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: o.status === 'Active' ? 'Expired' : 'Active' } : o)),
      ),
    [setOffers],
  )

  // Orders placed in the customer app for Nova Streetwear show up live in the dashboard.
  const adminOrders = useMemo<AdminOrder[]>(() => {
    const known = new Set(ADMIN_ORDERS.map((o) => o.id))
    const now = Date.now()
    const live: AdminOrder[] = customer.orders
      .filter((o) => o.storeId === 'nova' && !known.has(o.id))
      .map((o) => ({
        id: o.id,
        customer: customer.signedIn ? 'Joud Chamaa' : 'Guest customer',
        email: customer.signedIn ? 'joud@example.com' : 'guest@brandora.app',
        phone: '+961 71 234 567',
        product: o.items[0]?.name + (o.items.length > 1 ? ` +${o.items.length - 1} more` : ''),
        items: o.items.reduce((s, i) => s + i.qty, 0),
        total: o.total,
        payment: 'Cash on delivery',
        status: STAGE_TO_STATUS[orderStage(o, now)],
        date: 'Today',
        address: o.address,
        live: true,
      }))
    return [...live, ...ADMIN_ORDERS].map((o) => (statusOverrides[o.id] ? { ...o, status: statusOverrides[o.id] } : o))
  }, [customer.orders, customer.signedIn, statusOverrides])

  const value = useMemo<BusinessApi>(() => {
    const logo = getLogo(logoId)
    const themeOption = getTheme(themeId)
    return {
      profile,
      setProfile,
      planId,
      plan: getPlan(planId),
      setPlanId,
      paid,
      setPaid,
      logoId,
      logo,
      setLogoId,
      themeId,
      themeOption,
      setThemeId,
      generated,
      setGenerated,
      submitted,
      setSubmitted,
      builder,
      updateBuilder,
      resetBuilder: () => setBuilder(DEFAULT_BUILDER),
      storeTheme: buildStoreTheme(logo, themeOption, builder),
      products,
      addProduct,
      adjustStock,
      adminOrders,
      setOrderStatus,
      staff,
      addStaff,
      offers,
      addOffer,
      toggleOffer,
    }
  }, [
    profile,
    setProfile,
    planId,
    setPlanId,
    paid,
    setPaid,
    logoId,
    setLogoId,
    themeId,
    setThemeId,
    generated,
    setGenerated,
    submitted,
    setSubmitted,
    builder,
    updateBuilder,
    setBuilder,
    products,
    addProduct,
    adjustStock,
    adminOrders,
    setOrderStatus,
    staff,
    addStaff,
    offers,
    addOffer,
    toggleOffer,
  ])

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}

export function useBusiness() {
  const ctx = useContext(BusinessContext)
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider')
  return ctx
}
