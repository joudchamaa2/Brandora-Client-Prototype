import { motion } from 'framer-motion'
import { LayoutDashboard, RotateCcw, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { clearStored, cn } from '../../lib/utils'
import { BrandMark } from './BrandLogo'
import { Button } from './Button'
import { Modal } from './Modal'

type Experience = 'customer' | 'business'

/* Last visited path per experience so switching back resumes the demo */
const lastPath: Record<Experience, string> = { customer: '/customer', business: '/business' }

export function rememberPath(experience: Experience, path: string) {
  lastPath[experience] = path
}

const OPTIONS: { key: Experience; label: string; short: string; icon: typeof Smartphone }[] = [
  { key: 'customer', label: 'Customer App', short: 'Customer', icon: Smartphone },
  { key: 'business', label: 'Business Dashboard', short: 'Business', icon: LayoutDashboard },
]

/** Top bar used while presenting: switch between the two Brandora experiences */
export function PresentationBar({ experience }: { experience: Experience }) {
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <header className="sticky top-0 z-50 h-16 shrink-0 border-b border-line/60 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="hidden w-56 items-center gap-2.5 md:flex">
          <BrandMark size={30} />
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-wide text-fg">Brandora</div>
            <div className="text-[11px] text-dim">Interactive product demo</div>
          </div>
        </div>

        <nav
          aria-label="Choose experience"
          className="mx-auto flex rounded-full border border-line bg-surface/80 p-1 shadow-card md:mx-0"
        >
          {OPTIONS.map((o) => {
            const active = experience === o.key
            return (
              <button
                key={o.key}
                onClick={() => !active && navigate(lastPath[o.key])}
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors sm:px-5',
                  active ? 'text-gold-ink' : 'text-muted hover:text-fg',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="presentation-switch"
                    className="absolute inset-0 rounded-full gold-gradient shadow-glow"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <o.icon className="relative size-4" />
                <span className="relative hidden sm:inline">{o.label}</span>
                <span className="relative sm:hidden">{o.short}</span>
              </button>
            )
          })}
        </nav>

        <div className="flex w-auto justify-end md:w-56">
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-dim transition-colors hover:bg-surface hover:text-fg"
            title="Restart demo"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden lg:inline">Restart demo</span>
          </button>
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Restart the demo?"
        description="This clears the cart, favorites, orders and the business store setup so you can present from the beginning."
        width="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                clearStored()
                window.location.assign('/customer')
              }}
            >
              Restart from splash
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          Everything in this prototype is demo data stored in your browser. Nothing is sent to a server.
        </p>
      </Modal>
    </header>
  )
}
