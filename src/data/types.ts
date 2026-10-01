/* ------------------------------------------------------------------ */
/*  Shared domain types for the Brandora prototype (mock data only)    */
/* ------------------------------------------------------------------ */

export type CategoryKey = 'fashion' | 'other'

export type StoreIcon = 'shirt' | 'gem' | 'leaf' | 'smartphone' | 'sparkles' | 'home'

export interface Store {
  id: string
  name: string
  tagline: string
  category: CategoryKey
  rating: number
  reviews: number
  featured: boolean
  verified: boolean
  wholesale: boolean
  description: string
  icon: StoreIcon
  /** Accent used for generated store visuals (banner glow, monogram ring) */
  accent: string
  deliveryTime: string
  location: string
}

/** Drives the generated product artwork (garment silhouettes or icons) */
export type ProductKind =
  | 'jacket'
  | 'pants'
  | 'tee'
  | 'hoodie'
  | 'dress'
  | 'blazer'
  | 'shirt'
  | 'trousers'
  | 'scarf'
  | 'earbuds'
  | 'charger'
  | 'watch'
  | 'speaker'
  | 'serum'
  | 'lipstick'
  | 'perfume'
  | 'vase'
  | 'blanket'
  | 'candle'
  | 'lamp'

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  storeId: string
  name: string
  kind: ProductKind
  price: number
  wholesalePrice?: number
  minWholesale?: number
  sizes: string[]
  colors: ProductColor[]
  description: string
  rating: number
  badge?: string
}

export type PriceMode = 'retail' | 'wholesale'

export interface CartItem {
  key: string
  productId: string
  storeId: string
  size?: string
  color?: string
  mode: PriceMode
  unitPrice: number
  qty: number
}

export interface OrderItem {
  productId: string
  name: string
  size?: string
  color?: string
  qty: number
  unitPrice: number
  mode: PriceMode
}

/** 0 accepted · 1 picked up · 2 processing · 3 out for delivery · 4 delivered */
export type OrderStage = 0 | 1 | 2 | 3 | 4

export interface Order {
  id: string
  storeId: string
  items: OrderItem[]
  subtotal: number
  delivery: number
  total: number
  address: string
  payment: 'cod'
  placedAt: number
  /** When set the stage is fixed; otherwise it advances with time (live demo) */
  fixedStage?: OrderStage
  rating?: number
  driver: { name: string; rating: number }
}

/* ---------------------------- Business ---------------------------- */

export type PlanId = 'starter' | 'growth' | 'premium' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  price: number
  tagline: string
  features: string[]
  highlight?: string
}

export type LogoShape = 'ring' | 'prism' | 'hex' | 'leaf' | 'wave' | 'arch'

export interface LogoPalette {
  primary: string
  secondary: string
  dark: string
  light: string
}

export interface LogoOption {
  id: string
  name: string
  description: string
  shape: LogoShape
  palette: LogoPalette
  /** Font family key used by the wordmark */
  font: FontKey
  paletteName: string
}

export type FontKey = 'serif' | 'display' | 'sans' | 'heavy'

export type ThemeId = 'luxury' | 'minimal' | 'modern' | 'fashion' | 'bold'

export type HeroStyle = 'centered' | 'split' | 'editorial' | 'banner'
export type ButtonShape = 'square' | 'rounded' | 'pill'

export interface ThemeOption {
  id: ThemeId
  name: string
  description: string
  mode: 'dark' | 'light'
  headingFont: FontKey
  heroStyle: HeroStyle
  buttonShape: ButtonShape
  radius: number
  uppercase: boolean
  cardStyle: 'bordered' | 'elevated' | 'flat'
}

export type AdminOrderStatus = 'Pending' | 'Accepted' | 'Processing' | 'Out for delivery' | 'Delivered'

export interface AdminOrder {
  id: string
  customer: string
  email: string
  phone: string
  product: string
  items: number
  total: number
  payment: 'Cash on delivery'
  status: AdminOrderStatus
  date: string
  address: string
  /** True when the order was placed from the customer app during this demo */
  live?: boolean
}

export type ProductStatus = 'Active' | 'Draft' | 'Archived'

export interface AdminProduct {
  id: string
  name: string
  kind: ProductKind
  category: string
  price: number
  stock: number
  status: ProductStatus
  sales: number
  sku: string
  color: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Store Manager' | 'Sales' | 'Fulfillment' | 'Support'
  status: 'Active' | 'Invited' | 'Inactive'
  lastActive: string
  color: string
}

export type OfferStatus = 'Active' | 'Scheduled' | 'Expired'

export interface Offer {
  id: string
  name: string
  value: string
  description: string
  code: string
  status: OfferStatus
  starts: string
  ends: string
  redemptions: number
  revenue: number
}

export interface SeriesPoint {
  label: string
  revenue: number
  orders: number
  customers: number
  conversion: number
}

export type RangeKey = '7d' | '30d' | '90d' | '12m'
