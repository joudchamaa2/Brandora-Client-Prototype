import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PlanCard } from '../../../components/business/PlanCard'
import { Button } from '../../../components/shared/Button'
import { useBusiness } from '../../../context/BusinessContext'
import { PLANS } from '../../../data/plans'

const INCLUDED = ['Brandora marketplace listing', 'Cash on delivery orders', 'Live delivery tracking', 'Website builder', 'Mobile-ready storefront']

export function PlansPage() {
  const navigate = useNavigate()
  const { planId, setPlanId, plan, setPaid } = useBusiness()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="text-center">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Choose your Brandora plan
        </motion.h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">Simple monthly pricing. Upgrade, downgrade or cancel anytime.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PlanCard
              plan={p}
              selected={p.id === planId}
              onSelect={() => {
                if (p.id !== planId) setPaid(false)
                setPlanId(p.id)
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
        <span className="text-dim">Every plan includes:</span>
        {INCLUDED.map((i) => (
          <span key={i} className="flex items-center gap-1.5">
            <Check className="size-3.5 text-success" /> {i}
          </span>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <Button variant="ghost" onClick={() => navigate('/business/onboarding')} icon={<ArrowLeft className="size-4" />}>
          Back
        </Button>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">
            {plan.name} · <span className="font-semibold text-fg">${plan.price}/month</span>
          </span>
          <Button size="lg" onClick={() => navigate('/business/payment')}>
            Continue <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
