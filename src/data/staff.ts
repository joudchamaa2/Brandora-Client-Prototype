import type { StaffMember } from './types'

export const STAFF: StaffMember[] = [
  { id: 'st-1', name: 'Joud Chamaa', email: 'joud@example.com', role: 'Owner', status: 'Active', lastActive: 'Now', color: '#E8B948' },
  { id: 'st-2', name: 'Karim M.', email: 'karim@novastreetwear.com', role: 'Store Manager', status: 'Active', lastActive: '12 min ago', color: '#60A5FA' },
  { id: 'st-3', name: 'Sara A.', email: 'sara@novastreetwear.com', role: 'Sales', status: 'Active', lastActive: '1 h ago', color: '#F472B6' },
  { id: 'st-4', name: 'Omar H.', email: 'omar@novastreetwear.com', role: 'Fulfillment', status: 'Active', lastActive: 'Yesterday', color: '#34D399' },
  { id: 'st-5', name: 'Lea R.', email: 'lea@novastreetwear.com', role: 'Support', status: 'Invited', lastActive: '—', color: '#A78BFA' },
]

export const STAFF_ROLES: StaffMember['role'][] = ['Store Manager', 'Sales', 'Fulfillment', 'Support']

export const ROLE_PERMISSIONS: Record<StaffMember['role'], string> = {
  Owner: 'Full access, billing & subscription',
  'Store Manager': 'Products, orders, offers & staff',
  Sales: 'Orders & customers',
  Fulfillment: 'Orders & inventory',
  Support: 'Orders (read-only) & customers',
}
