import { motion } from 'framer-motion'
import { ChevronRight, Shirt, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import { BrandLogo } from '../../components/shared/BrandLogo'
import { useCustomer } from '../../context/CustomerContext'
import { STORES } from '../../data/stores'
import type { CategoryKey } from '../../data/types'

const CATEGORIES: { key: CategoryKey; label: string; icon: typeof Shirt; examples: string }[] = [
  { key: 'fashion', label: 'Clothing & Fashion', icon: Shirt, examples: 'Streetwear · Luxury · Minimal' },
  { key: 'other', label: 'Other Shops', icon: Sparkles, examples: 'Electronics · Beauty · Home' },
]

export function CategoryScreen() {
  const navigate = useNavigate()
  const { setCategory } = useCustomer()

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto px-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center pb-10 pt-8"
      >
        <BrandLogo size="sm" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center">
        <h1 className="text-[26px] font-bold tracking-tight text-fg">What are you shopping for?</h1>
        <p className="mt-2 text-[15px] text-muted">Pick a category to discover stores</p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-4">
        {CATEGORIES.map((c, i) => {
          const count = STORES.filter((s) => s.category === c.key).length
          return (
            <motion.button
              key={c.key}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setCategory(c.key)
                navigate('/customer/home')
              }}
              className="group flex items-center gap-4 rounded-3xl border border-line bg-gradient-to-br from-surface to-surface-2 p-5 text-left shadow-card transition-colors hover:border-gold/40"
            >
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold/10 ring-1 ring-gold/20 transition-colors group-hover:bg-gold/15">
                <c.icon className="size-7 text-gold" strokeWidth={1.7} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-bold text-fg">{c.label}</div>
                <div className="mt-0.5 text-[13px] text-muted">Browse {count} verified stores</div>
                <div className="mt-1.5 text-[11px] text-dim">{c.examples}</div>
              </div>
              <ChevronRight className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
            </motion.button>
          )
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto pt-10 text-center text-xs text-dim"
      >
        You can switch categories anytime from Home.
      </motion.p>
    </div>
  )
}
