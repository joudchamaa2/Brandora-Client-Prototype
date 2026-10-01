import { motion } from 'framer-motion'
import { ArrowRight, Banknote, BarChart3, CreditCard, LayoutTemplate, Palette, Rocket, Sparkles, Store, Truck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Field, inputClass } from '../../../components/business/DashboardUI'
import { Button } from '../../../components/shared/Button'
import { Segmented } from '../../../components/shared/Segmented'
import { useBusiness, type BusinessProfile } from '../../../context/BusinessContext'
import { cn } from '../../../lib/utils'

const CATEGORIES = ['Clothing & Fashion', 'Electronics', 'Beauty', 'Home & Living']

const STEPS = [
  { icon: CreditCard, title: 'Choose a plan', body: 'Pick the subscription that fits your business.' },
  { icon: Palette, title: 'Create your brand', body: 'Select a logo concept made for your store.' },
  { icon: LayoutTemplate, title: 'Generate your theme', body: 'Brandora builds a storefront from your logo.' },
  { icon: Rocket, title: 'Preview & launch', body: 'Review your store and submit it for approval.' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useBusiness()
  const [form, setForm] = useState<BusinessProfile>(profile)

  const start = () => {
    setProfile({ ...form, storeName: form.storeName.trim() || 'Nova Streetwear' })
    navigate('/business/plans')
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-14">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold"
        >
          <Sparkles className="size-3.5" /> For businesses
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-fg sm:text-5xl"
        >
          Create your <span className="gold-text">Brandora</span> Store
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="mt-4 max-w-lg text-lg text-muted">
          Launch your business with a professional online store — branded, discoverable on the Brandora marketplace and ready to take
          orders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface mt-8 space-y-5 rounded-3xl p-6"
        >
          <Field label="Store name">
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gold" />
              <input
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                placeholder="e.g. Nova Streetwear"
                className={cn(inputClass, 'pl-10')}
                maxLength={28}
              />
            </div>
          </Field>
          <Field label="What do you sell?">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, category: c })}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                    form.category === c ? 'border-gold bg-gold/10 text-gold' : 'border-line text-muted hover:border-line-strong hover:text-fg',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
          <Field label="How do you sell?">
            <Segmented
              className="flex w-full"
              value={form.businessType}
              onChange={(v) => setForm({ ...form, businessType: v })}
              options={[
                { value: 'Retail', label: 'Retail' },
                { value: 'Wholesale', label: 'Wholesale' },
                { value: 'Retail + Wholesale', label: 'Both' },
              ]}
            />
          </Field>
          <Button size="lg" block onClick={start} disabled={!form.storeName.trim()}>
            Start setup <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 lg:pt-14">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-dim">Your launch in 4 steps</div>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="card-surface flex items-center gap-4 rounded-2xl p-4"
          >
            <span className="font-display text-2xl font-bold text-gold/40">0{i + 1}</span>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
              <s.icon className="size-5" />
            </span>
            <div>
              <div className="text-[15px] font-semibold text-fg">{s.title}</div>
              <div className="text-[13px] text-muted">{s.body}</div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 grid grid-cols-3 gap-3"
        >
          {[
            { icon: Store, value: '1,200+', label: 'stores on Brandora' },
            { icon: Banknote, value: 'COD', label: 'built-in for customers' },
            { icon: Truck, value: 'Live', label: 'delivery tracking' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line p-3.5 text-center">
              <s.icon className="mx-auto size-4 text-gold" />
              <div className="mt-2 text-lg font-bold text-fg">{s.value}</div>
              <div className="text-[11px] text-muted">{s.label}</div>
            </div>
          ))}
        </motion.div>
        <div className="flex items-center gap-2 text-xs text-dim">
          <BarChart3 className="size-3.5" /> Manage orders, products, offers and analytics from one dashboard.
        </div>
      </div>
    </div>
  )
}
