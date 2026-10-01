import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Info, Loader2, ShieldCheck, Smartphone, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/shared/Button'
import { useBusiness } from '../../../context/BusinessContext'
import { cn, sleep } from '../../../lib/utils'
import { SuccessCheck } from '../../../components/shared/SuccessCheck'

const PROCESS_STEPS = ['Connecting to Whish Money', 'Authorizing payment', 'Activating subscription']

type Phase = 'form' | 'processing' | 'success'

export function PaymentPage() {
  const navigate = useNavigate()
  const { plan, paid, setPaid, profile } = useBusiness()
  const [phase, setPhase] = useState<Phase>(paid ? 'success' : 'form')
  const [step, setStep] = useState(0)

  const pay = async () => {
    setPhase('processing')
    for (let i = 0; i < PROCESS_STEPS.length; i++) {
      setStep(i)
      await sleep(900)
    }
    setStep(PROCESS_STEPS.length)
    await sleep(300)
    setPaid(true)
    setPhase('success')
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-14">
      {/* Summary */}
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="order-2 lg:order-1">
        <h1 className="text-3xl font-bold tracking-tight text-fg">Confirm your subscription</h1>
        <p className="mt-2 text-muted">You're one step away from launching {profile.storeName}.</p>

        <div className="card-surface mt-8 rounded-3xl p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-dim">Order summary</div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-fg">Brandora {plan.name}</div>
              <div className="text-sm text-muted">Monthly subscription</div>
            </div>
            <button onClick={() => navigate('/business/plans')} className="text-xs font-semibold text-gold hover:underline">
              Change
            </button>
          </div>
          <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
            <Row label="Plan" value={plan.name} />
            <Row label="Amount" value={`$${plan.price} / month`} />
            <Row label="Billing period" value="Monthly" />
            <Row label="Next renewal" value="Nov 2, 2026" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <span className="font-semibold text-fg">Due today</span>
            <span className="font-display text-2xl font-bold text-gold">${plan.price}.00</span>
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-[13px] text-muted">
          {plan.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="size-4 text-success" /> {f}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Payment panel */}
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="order-1 lg:order-2">
        <div className="card-surface relative min-h-[520px] overflow-hidden rounded-3xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {phase === 'form' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                <div className="text-sm font-semibold text-fg">Payment method</div>

                {/* Wallet card */}
                <motion.div
                  initial={{ rotateX: 18, opacity: 0, y: 10 }}
                  animate={{ rotateX: 0, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                  className="relative mt-4 aspect-[1.7] w-full overflow-hidden rounded-2xl p-6"
                  style={{
                    background:
                      'radial-gradient(120% 120% at 100% 0%, rgba(232,185,72,0.35), transparent 50%), linear-gradient(135deg, #1c2848 0%, #0b1122 100%)',
                    border: '1px solid rgba(232,185,72,0.35)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-10 place-items-center rounded-xl gold-gradient text-gold-ink">
                        <Wallet className="size-5" />
                      </span>
                      <div>
                        <div className="text-base font-bold text-fg">Whish Money</div>
                        <div className="text-[11px] text-muted">Digital wallet</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
                      <Check className="size-3" /> Selected
                    </span>
                  </div>
                  <div className="absolute inset-x-6 bottom-6">
                    <div className="font-display text-xl tracking-[0.2em] text-fg">+961 •• ••• 456</div>
                    <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wider text-muted">
                      <span>{profile.storeName}</span>
                      <span>Business account</span>
                    </div>
                  </div>
                </motion.div>

                <label className="mt-6 block">
                  <span className="mb-1.5 block text-[13px] font-medium text-fg">Wallet phone number</span>
                  <div className="flex h-12 items-center gap-2.5 rounded-xl border border-line bg-bg-2 px-3.5">
                    <Smartphone className="size-4 text-gold" />
                    <span className="text-sm text-fg">+961 70 123 456</span>
                    <span className="ml-auto text-[11px] text-dim">Demo number</span>
                  </div>
                </label>

                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-info/25 bg-info/8 p-3.5 text-[12.5px] text-muted">
                  <Info className="mt-0.5 size-4 shrink-0 text-info" />
                  Demo only — no real payment is processed and no wallet is charged.
                </div>

                <Button size="lg" block className="mt-6" onClick={pay}>
                  Pay ${plan.price}
                </Button>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-dim">
                  <ShieldCheck className="size-3.5" /> Secured payment · Cancel anytime
                </div>
              </motion.div>
            )}

            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[456px] flex-col items-center justify-center text-center"
              >
                <div className="relative grid size-24 place-items-center">
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                  <Wallet className="size-8 text-gold" />
                </div>
                <div className="mt-6 text-xl font-semibold text-fg">Processing payment…</div>
                <div className="mt-1 text-sm text-muted">Please don't close this window</div>
                <ul className="mt-8 w-full max-w-xs space-y-3 text-left">
                  {PROCESS_STEPS.map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span
                        className={cn(
                          'grid size-6 place-items-center rounded-full transition-colors',
                          i < step ? 'gold-gradient text-gold-ink' : i === step ? 'border border-gold text-gold' : 'border border-line text-dim',
                        )}
                      >
                        {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i === step ? <Loader2 className="size-3.5 animate-spin" /> : null}
                      </span>
                      <span className={i <= step ? 'text-fg' : 'text-dim'}>{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {phase === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[456px] flex-col items-center justify-center text-center"
              >
                <SuccessCheck size={104} />
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <div className="mt-7 text-2xl font-bold text-fg">Payment successful</div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-success/12 px-3 py-1 text-sm font-semibold text-success">
                    <span className="size-1.5 rounded-full bg-success" /> Subscription active
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mt-7 w-full max-w-sm space-y-2 rounded-2xl border border-line bg-bg-2/60 p-4 text-left text-sm"
                >
                  <Row label="Plan" value={`${plan.name} · $${plan.price}/month`} />
                  <Row label="Paid with" value="Whish Money" />
                  <Row label="Transaction" value="WM-2026-48213" />
                </motion.div>
                <Button size="lg" className="mt-7 min-w-[220px]" onClick={() => navigate('/business/branding')}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {phase === 'form' && (
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/business/plans')} icon={<ArrowLeft className="size-4" />}>
            Back to plans
          </Button>
        )}
      </motion.div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-fg">{value}</span>
    </div>
  )
}
