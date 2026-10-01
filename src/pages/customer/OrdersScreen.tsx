import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { OrderCard } from '../../components/customer/OrderCard'
import { Button } from '../../components/shared/Button'
import { EmptyState } from '../../components/shared/EmptyState'
import { listContainer } from '../../components/shared/PageTransition'
import { Segmented } from '../../components/shared/Segmented'
import { orderStage, useCustomer } from '../../context/CustomerContext'
import { useNow } from '../../lib/usePersistentState'

type Tab = 'all' | 'active' | 'delivered'

export function OrdersScreen() {
  const navigate = useNavigate()
  const { orders } = useCustomer()
  const now = useNow(1000)
  const [tab, setTab] = useState<Tab>('all')

  const list = orders.filter((o) => {
    const s = orderStage(o, now)
    return tab === 'all' || (tab === 'delivered' ? s === 4 : s < 4)
  })

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-[22px] font-bold tracking-tight text-fg">Orders</h1>
        <Segmented
          className="mt-3 flex w-full"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'delivered', label: 'Delivered' },
          ]}
        />
      </div>
      <div className="no-scrollbar mt-4 flex-1 overflow-y-auto px-5 pb-6">
        {list.length === 0 ? (
          <EmptyState
            icon={<Package className="size-7" />}
            title={tab === 'active' ? 'No active orders' : 'No orders yet'}
            description="When you place an order it will appear here so you can track it."
            action={<Button onClick={() => navigate('/customer/home')}>Start shopping</Button>}
          />
        ) : (
          <motion.div key={tab} variants={listContainer} initial="initial" animate="enter" className="flex flex-col gap-3">
            {list.map((o) => (
              <OrderCard key={o.id} order={o} now={now} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
