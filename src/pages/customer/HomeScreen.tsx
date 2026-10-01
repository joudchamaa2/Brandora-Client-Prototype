import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, MapPin, Store as StoreIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { CartButton } from '../../components/customer/ScreenHeader'
import { FilterChip, SearchBar } from '../../components/customer/SearchBar'
import { StoreCard } from '../../components/customer/StoreCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { listContainer } from '../../components/shared/PageTransition'
import { Segmented } from '../../components/shared/Segmented'
import { ProductArt } from '../../components/visuals/ProductArt'
import { useCustomer, type HomeFilter } from '../../context/CustomerContext'
import { STORES } from '../../data/stores'
import type { CategoryKey } from '../../data/types'

const FILTERS: { key: HomeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'featured', label: 'Featured' },
  { key: 'wholesale', label: 'Wholesale' },
]

function PromoBanner({ category }: { category: CategoryKey }) {
  const navigate = useNavigate()
  const promo =
    category === 'fashion'
      ? { store: 'nova', eyebrow: 'Nova Streetwear', title: 'Summer Sale — 20% off', kind: 'jacket' as const, color: '#23262f' }
      : { store: 'techhub', eyebrow: 'TechHub Electronics', title: 'Audio week — up to 30% off', kind: 'earbuds' as const, color: '#7AB2F5' }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/customer/store/${promo.store}`)}
      className="relative flex w-full items-center overflow-hidden rounded-[22px] border border-gold/25 p-4 text-left"
      style={{ background: 'linear-gradient(120deg, rgba(232,185,72,0.18), rgba(17,26,50,0.9) 55%), #111a32' }}
    >
      <div className="relative z-10 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{promo.eyebrow}</div>
        <div className="mt-1 max-w-[170px] text-[17px] font-bold leading-snug text-fg">{promo.title}</div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[11px] font-bold text-gold-ink">
          Shop now <ArrowRight className="size-3" />
        </div>
      </div>
      <ProductArt kind={promo.kind} color={promo.color} className="size-[108px] shrink-0 border-gold/20" scale={0.7} />
    </motion.button>
  )
}

export function HomeScreen() {
  const navigate = useNavigate()
  const { category, setCategory, homeFilter, setHomeFilter, signedIn } = useCustomer()

  const stores = STORES.filter(
    (s) =>
      s.category === category &&
      (homeFilter === 'all' || (homeFilter === 'featured' ? s.featured : s.wholesale)),
  )

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-6">
      <div className="px-5 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="size-3.5 text-gold" /> Delivering to your location
            </div>
            <button className="mt-0.5 flex items-center gap-1 text-[15px] font-semibold text-fg">
              Hamra, Beirut <ChevronDown className="size-4 text-muted" />
            </button>
          </div>
          <CartButton />
        </div>

        <div className="mt-4 text-[22px] font-bold tracking-tight text-fg">
          {signedIn ? 'Hi Joud,' : 'Welcome,'} <span className="text-muted">discover something new</span>
        </div>

        <SearchBar
          value=""
          onChange={() => undefined}
          onFocus={() => navigate('/customer/search')}
          readOnly
          className="mt-4 cursor-pointer"
        />

        <div className="mt-4 flex items-center gap-2">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <FilterChip key={f.key} active={homeFilter === f.key} onClick={() => setHomeFilter(f.key)}>
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <PromoBanner key={category} category={category} />
        </div>

        <div className="mb-3 mt-6 flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-fg">Stores</h2>
            <p className="text-xs text-muted">{stores.length} verified stores near you</p>
          </div>
          <Segmented
            size="sm"
            value={category}
            onChange={setCategory}
            options={[
              { value: 'fashion', label: 'Fashion' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>
      </div>

      {stores.length === 0 ? (
        <EmptyState
          icon={<StoreIcon className="size-7" />}
          title="No stores match this filter"
          description="Try another filter or switch category."
        />
      ) : (
        <motion.div
          key={`${category}-${homeFilter}`}
          variants={listContainer}
          initial="initial"
          animate="enter"
          className="grid grid-cols-2 gap-3 px-5"
        >
          {stores.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
