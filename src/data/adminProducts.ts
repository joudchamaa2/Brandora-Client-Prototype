import type { AdminProduct } from './types'

/** Catalog of the demo store (Nova Streetwear) as seen in the business dashboard */
export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'ap-1', name: 'Oversized Bomber Jacket', kind: 'jacket', category: 'Outerwear', price: 89, stock: 24, status: 'Active', sales: 48, sku: 'NOV-BMB-001', color: '#23262f' },
  { id: 'ap-2', name: 'Cargo Utility Pants', kind: 'pants', category: 'Bottoms', price: 64, stock: 8, status: 'Active', sales: 46, sku: 'NOV-CRG-002', color: '#5d6b3a' },
  { id: 'ap-3', name: 'Graphic Tee — Nova Logo', kind: 'tee', category: 'Tees', price: 29, stock: 51, status: 'Active', sales: 64, sku: 'NOV-TEE-003', color: '#f1f1ee' },
  { id: 'ap-4', name: 'Heavyweight Hoodie', kind: 'hoodie', category: 'Hoodies', price: 72, stock: 17, status: 'Active', sales: 21, sku: 'NOV-HOD-004', color: '#3c4150' },
  { id: 'ap-5', name: 'Denim Trucker Jacket', kind: 'jacket', category: 'Outerwear', price: 95, stock: 3, status: 'Active', sales: 12, sku: 'NOV-DNM-005', color: '#2b3a67' },
  { id: 'ap-6', name: 'Track Jacket', kind: 'jacket', category: 'Outerwear', price: 79, stock: 15, status: 'Active', sales: 18, sku: 'NOV-TRK-006', color: '#7a2e3b' },
  { id: 'ap-7', name: 'Utility Vest', kind: 'tee', category: 'Outerwear', price: 58, stock: 0, status: 'Active', sales: 9, sku: 'NOV-VST-007', color: '#9a958c' },
  { id: 'ap-8', name: 'Relaxed Chino Pants', kind: 'trousers', category: 'Bottoms', price: 54, stock: 32, status: 'Active', sales: 15, sku: 'NOV-CHN-008', color: '#c9b28a' },
  { id: 'ap-9', name: 'Windbreaker Shell', kind: 'jacket', category: 'Outerwear', price: 84, stock: 0, status: 'Draft', sales: 0, sku: 'NOV-WND-009', color: '#5d6b3a' },
  { id: 'ap-10', name: 'Logo Crewneck', kind: 'hoodie', category: 'Hoodies', price: 62, stock: 6, status: 'Active', sales: 11, sku: 'NOV-CRW-010', color: '#c9b28a' },
  { id: 'ap-11', name: 'Washed Long Sleeve', kind: 'shirt', category: 'Tees', price: 36, stock: 40, status: 'Active', sales: 22, sku: 'NOV-LSL-011', color: '#9a958c' },
  { id: 'ap-12', name: 'Archive Tee 2025', kind: 'tee', category: 'Tees', price: 25, stock: 0, status: 'Archived', sales: 73, sku: 'NOV-ARC-012', color: '#23262f' },
]

export const PRODUCT_CATEGORIES = ['Outerwear', 'Bottoms', 'Tees', 'Hoodies', 'Accessories']

/** Thresholds used by the inventory dashboard */
export const LOW_STOCK_THRESHOLD = 10

export const stockState = (stock: number) =>
  stock === 0 ? 'Out of stock' : stock <= LOW_STOCK_THRESHOLD ? 'Low stock' : 'In stock'
