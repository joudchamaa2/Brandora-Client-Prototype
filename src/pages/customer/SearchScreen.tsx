import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpLeft, Clock, SearchX, ShieldCheck, Star, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { SearchBar } from '../../components/customer/SearchBar'
import { EmptyState } from '../../components/shared/EmptyState'
import { listContainer, listItem } from '../../components/shared/PageTransition'
import { Segmented } from '../../components/shared/Segmented'
import { ProductArt } from '../../components/visuals/ProductArt'
import { StoreLogo } from '../../components/visuals/StoreVisual'
import { useCustomer } from '../../context/CustomerContext'
import { PRODUCTS } from '../../data/products'
import { getStore, STORES } from '../../data/stores'

type Tab = 'stores' | 'products'

const POPULAR = ['Hoodie', 'Silk dress', 'Smart watch', 'Serum', 'Candle', 'Cargo pants']

const matches = (q: string, ...fields: string[]) => {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = fields.join(' ').toLowerCase()
  return terms.every((t) => hay.includes(t.replace(/s$/, '')))
}

export function SearchScreen() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { recentSearches, addRecentSearch, clearRecentSearches } = useCustomer()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const tab: Tab = params.get('tab') === 'products' ? 'products' : 'stores'

  const setTab = (t: Tab) => setParams((p) => ({ ...Object.fromEntries(p), tab: t }), { replace: true })

  const storeResults = useMemo(
    () => (query.trim() ? STORES.filter((s) => matches(query, s.name, s.tagline, s.description, s.location)) : []),
    [query],
  )
  const productResults = useMemo(
    () =>
      query.trim()
        ? PRODUCTS.filter((p) => matches(query, p.name, p.kind, p.description, getStore(p.storeId)?.name ?? ''))
        : [],
    [query],
  )

  const runSearch = (term: string) => {
    setQuery(term)
    addRecentSearch(term)
    // Jump to the tab that actually has results
    const s = STORES.some((x) => matches(term, x.name, x.tagline, x.description))
    const p = PRODUCTS.some((x) => matches(term, x.name, x.kind, x.description))
    if (!s && p) setTab('products')
    if (s && !p) setTab('stores')
  }

  const results = tab === 'stores' ? storeResults : productResults

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-[22px] font-bold tracking-tight text-fg">Search</h1>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => addRecentSearch(query)}
          autoFocus
          className="mt-3"
        />
        <Segmented
          className="mt-3 flex w-full"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'stores', label: `Stores${query ? ` (${storeResults.length})` : ''}` },
            { value: 'products', label: `Products${query ? ` (${productResults.length})` : ''}` },
          ]}
        />
      </div>

      <div className="no-scrollbar mt-3 flex-1 overflow-y-auto px-5 pb-6">
        <AnimatePresence mode="wait">
          {!query.trim() ? (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {recentSearches.length > 0 && (
                <section className="mt-2">
                  <div className="mb-2.5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-fg">Recent searches</h2>
                    <button onClick={clearRecentSearches} className="text-xs font-medium text-muted hover:text-gold">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {recentSearches.map((r) => (
                      <button
                        key={r}
                        onClick={() => runSearch(r)}
                        className="flex items-center gap-3 border-b border-line/60 py-3 text-left text-sm text-fg last:border-0"
                      >
                        <Clock className="size-4 text-dim" />
                        <span className="flex-1">{r}</span>
                        <ArrowUpLeft className="size-3.5 text-dim" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-6">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                  <TrendingUp className="size-4 text-gold" /> Popular on Brandora
                </h2>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((p, i) => (
                    <motion.button
                      key={p}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => runSearch(p)}
                      className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-fg transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <h2 className="mb-3 text-sm font-semibold text-fg">Top rated stores</h2>
                <div className="flex flex-col gap-2.5">
                  {[...STORES].sort((a, b) => b.rating - a.rating).slice(0, 3).map((s) => (
                    <StoreRow key={s.id} storeId={s.id} onOpen={() => navigate(`/customer/store/${s.id}`)} />
                  ))}
                </div>
              </section>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                icon={<SearchX className="size-7" />}
                title={`No ${tab} for “${query}”`}
                description={`Try another keyword${tab === 'stores' ? ' or check the Products tab' : ' or check the Stores tab'}.`}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`${tab}-${query}`}
              variants={listContainer}
              initial="initial"
              animate="enter"
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2.5"
            >
              <p className="mb-1 text-xs text-muted">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              {tab === 'stores'
                ? storeResults.map((s) => (
                    <StoreRow
                      key={s.id}
                      storeId={s.id}
                      onOpen={() => {
                        addRecentSearch(query)
                        navigate(`/customer/store/${s.id}`)
                      }}
                    />
                  ))
                : productResults.map((p) => (
                    <motion.button
                      key={p.id}
                      variants={listItem}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addRecentSearch(query)
                        navigate(`/customer/product/${p.id}`)
                      }}
                      className="card-surface flex items-center gap-3 rounded-2xl p-2.5 text-left"
                    >
                      <ProductArt kind={p.kind} color={p.colors[0].hex} className="size-16 shrink-0" rounded="rounded-xl" scale={0.7} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-fg">{p.name}</div>
                        <div className="mt-0.5 truncate text-xs text-muted">{getStore(p.storeId)?.name}</div>
                        <div className="mt-1 text-sm font-bold text-gold">${p.price}</div>
                      </div>
                    </motion.button>
                  ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StoreRow({ storeId, onOpen }: { storeId: string; onOpen: () => void }) {
  const s = getStore(storeId)!
  return (
    <motion.button
      variants={listItem}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="card-surface flex items-center gap-3 rounded-2xl p-3 text-left"
    >
      <StoreLogo store={s} size={48} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-fg">
          <span className="truncate">{s.name}</span>
          {s.verified && <ShieldCheck className="size-3.5 shrink-0 text-gold" />}
        </div>
        <div className="mt-0.5 text-xs text-muted">
          {s.tagline} · {s.deliveryTime}
        </div>
      </div>
      <span className="flex items-center gap-1 text-xs font-semibold text-fg">
        <Star className="size-3.5 fill-gold text-gold" />
        {s.rating}
      </span>
    </motion.button>
  )
}
