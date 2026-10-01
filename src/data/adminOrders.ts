import type { AdminOrder, AdminOrderStatus } from './types'

export const ORDER_STATUSES: AdminOrderStatus[] = ['Pending', 'Accepted', 'Processing', 'Out for delivery', 'Delivered']

const o = (
  id: string,
  customer: string,
  product: string,
  items: number,
  total: number,
  status: AdminOrderStatus,
  date: string,
  address: string,
): AdminOrder => {
  const handle = customer.toLowerCase().replace(/[^a-z]+/g, '.')
  return {
    id,
    customer,
    email: `${handle}@example.com`,
    phone: `+961 7${(id.charCodeAt(5) % 9) + 1} ${id.slice(-3)} ${id.slice(3, 6)}`,
    product,
    items,
    total,
    payment: 'Cash on delivery',
    status,
    date,
    address,
  }
}

/** Orders received by the demo store (Nova Streetwear) */
export const ADMIN_ORDERS: AdminOrder[] = [
  o('BR-34862', 'Maya Haddad', 'Oversized Bomber Jacket', 1, 120, 'Accepted', 'Oct 2, 2026', 'Mar Mikhael, Beirut'),
  o('BR-34861', 'Ali Saab', 'Cargo Utility Pants', 1, 64, 'Processing', 'Oct 2, 2026', 'Verdun, Beirut'),
  o('BR-34859', 'Joud Chamaa', 'Oversized Bomber Jacket', 1, 92, 'Delivered', 'Oct 1, 2026', 'Hamra, Beirut'),
  o('BR-34857', 'Nour Khalil', 'Graphic Tee — Nova Logo', 3, 90, 'Out for delivery', 'Oct 1, 2026', 'Achrafieh, Beirut'),
  o('BR-34855', 'Rami Aoun', 'Heavyweight Hoodie', 1, 75, 'Pending', 'Oct 1, 2026', 'Jounieh'),
  o('BR-34852', 'Lara Nassar', 'Cargo Utility Pants', 2, 131, 'Delivered', 'Sep 30, 2026', 'Badaro, Beirut'),
  o('BR-34850', 'Tarek Fares', 'Oversized Bomber Jacket', 1, 92, 'Delivered', 'Sep 30, 2026', 'Jbeil'),
  o('BR-34847', 'Yasmine Rizk', 'Graphic Tee — Nova Logo', 2, 61, 'Delivered', 'Sep 29, 2026', 'Gemmayze, Beirut'),
  o('BR-34845', 'Hassan Itani', 'Utility Vest', 1, 61, 'Delivered', 'Sep 29, 2026', 'Ras Beirut'),
  o('BR-34842', 'Christelle Azar', 'Denim Trucker Jacket', 1, 98, 'Delivered', 'Sep 28, 2026', 'Zalka'),
  o('BR-34840', 'Jad Mansour', 'Wholesale · Graphic Tee ×24', 24, 435, 'Delivered', 'Sep 27, 2026', 'Saida'),
  o('BR-34838', 'Reem Daher', 'Nova Beanie', 2, 41, 'Delivered', 'Sep 27, 2026', 'Hamra, Beirut'),
  o('BR-34835', 'Fadi Karam', 'Track Jacket', 1, 82, 'Delivered', 'Sep 26, 2026', 'Antelias'),
  o('BR-34833', 'Dana Salameh', 'Heavyweight Hoodie', 1, 75, 'Delivered', 'Sep 25, 2026', 'Tripoli'),
]
