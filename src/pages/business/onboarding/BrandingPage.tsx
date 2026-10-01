import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import { LogoCard } from '../../../components/business/LogoCard'
import { Button } from '../../../components/shared/Button'
import { LogoMark, LogoSymbol } from '../../../components/visuals/LogoMark'
import { useBusiness } from '../../../context/BusinessContext'
import { LOGOS } from '../../../data/logos'
import type { LogoOption } from '../../../data/types'

/** Live brand mockups that update as the logo changes */
function BrandMockups({ logo, name }: { logo: LogoOption; name: string }) {
  const p = logo.palette
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={logo.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 gap-3"
      >
        {/* Shopping bag */}
        <div className="grid aspect-square place-items-center rounded-2xl border border-line" style={{ background: `linear-gradient(160deg, ${p.light}, #d9d4c8)` }}>
          <svg viewBox="0 0 100 100" className="w-[72%]" aria-hidden>
            <path d="M34 30 C34 14 66 14 66 30" fill="none" stroke={p.dark} strokeWidth="3" />
            <path d="M20 30 L80 30 L76 90 L24 90 Z" fill={p.dark} />
            <foreignObject x="35" y="44" width="30" height="30">
              <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
                <LogoSymbol logo={logo} name={name} size={28} />
              </div>
            </foreignObject>
          </svg>
        </div>
        {/* Business card */}
        <div className="grid aspect-square place-items-center rounded-2xl border border-line bg-surface-2 p-3">
          <div
            className="flex aspect-[1.6] w-full -rotate-6 flex-col justify-between rounded-lg p-2.5 shadow-xl"
            style={{ background: p.dark, border: `1px solid ${p.primary}55` }}
          >
            <LogoSymbol logo={logo} name={name} size={18} />
            <div className="h-1 w-1/2 rounded-full" style={{ background: p.primary }} />
          </div>
        </div>
        {/* App icon */}
        <div className="grid aspect-square place-items-center rounded-2xl border border-line bg-surface-2">
          <div className="grid size-16 place-items-center rounded-[18px] shadow-xl" style={{ background: p.dark, boxShadow: `0 12px 30px -10px ${p.primary}88` }}>
            <LogoSymbol logo={logo} name={name} size={40} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function BrandingPage() {
  const navigate = useNavigate()
  const { logoId, setLogoId, logo, profile } = useBusiness()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              <Sparkles className="size-3.5" /> 6 concepts generated for {profile.storeName}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Choose your brand logo</h1>
            <p className="mt-2 max-w-xl text-muted">
              Each concept comes with its own color palette. Your storefront theme will be generated from the logo you pick.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {LOGOS.map((l, i) => (
              <LogoCard key={l.id} index={i} logo={l} storeName={profile.storeName} selected={l.id === logoId} onSelect={() => setLogoId(l.id)} />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface rounded-3xl p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-dim">Selected logo</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="mt-4 grid h-36 place-items-center rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 30%, ${logo.palette.primary}30, transparent 70%), ${logo.palette.dark}` }}
              >
                <LogoMark logo={logo} name={profile.storeName} size={52} />
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-fg">{logo.name}</span>
              <span className="text-muted">{logo.paletteName}</span>
            </div>
            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-dim">On your brand</div>
            <div className="mt-3">
              <BrandMockups logo={logo} name={profile.storeName} />
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <Button variant="ghost" onClick={() => navigate('/business/payment')} icon={<ArrowLeft className="size-4" />}>
          Back
        </Button>
        <Button size="lg" onClick={() => navigate('/business/theme')}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
