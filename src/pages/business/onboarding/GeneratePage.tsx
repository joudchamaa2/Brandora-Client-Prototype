import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, LayoutTemplate, Loader2, Palette, ScanSearch, Sparkles, Type } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MiniStorefront } from '../../../components/business/previewHelpers'
import { Button } from '../../../components/shared/Button'
import { LogoMark, LogoSymbol } from '../../../components/visuals/LogoMark'
import { useBusiness } from '../../../context/BusinessContext'
import { FONT_LABELS } from '../../../data/themes'
import { FONT_STACKS, paletteSwatches } from '../../../lib/storeTheme'
import { cn } from '../../../lib/utils'

const STEPS = [
  { label: 'Analyzing logo', icon: ScanSearch },
  { label: 'Creating color palette', icon: Palette },
  { label: 'Applying typography', icon: Type },
  { label: 'Building storefront', icon: LayoutTemplate },
  { label: 'Finalizing theme', icon: Sparkles },
]
const STEP_MS = 1150

export function GeneratePage() {
  const navigate = useNavigate()
  const { logo, themeOption, profile, setGenerated } = useBusiness()
  const [step, setStep] = useState(0)
  const done = step >= STEPS.length

  useEffect(() => {
    if (done) {
      setGenerated(true)
      return
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [step, done, setGenerated])

  const swatches = paletteSwatches(logo)
  const progress = Math.min(100, Math.round((step / STEPS.length) * 100))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="working" exit={{ opacity: 0, scale: 0.98 }} className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            {/* Stage */}
            <div className="card-surface relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl">
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 45%, ${logo.palette.primary}26, transparent 60%)` }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="relative grid w-full place-items-center px-8"
                >
                  {step === 0 && (
                    <div className="relative">
                      <LogoSymbol logo={logo} name={profile.storeName} size={150} />
                      <motion.div
                        className="absolute inset-x-[-20px] h-[3px] rounded-full"
                        style={{ background: logo.palette.primary, boxShadow: `0 0 24px 6px ${logo.palette.primary}` }}
                        initial={{ top: 0 }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                  )}
                  {step === 1 && (
                    <div className="flex gap-3">
                      {swatches.map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ y: 30, opacity: 0, scale: 0.6 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 18 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="h-28 w-14 rounded-2xl border border-white/10 shadow-xl sm:w-16" style={{ background: s.hex }} />
                          <span className="text-[10px] font-medium uppercase text-muted">{s.hex}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {step === 2 && (
                    <div className="text-center">
                      <motion.div
                        initial={{ letterSpacing: '0.4em', opacity: 0 }}
                        animate={{ letterSpacing: '0em', opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-[96px] leading-none text-fg"
                        style={{ fontFamily: FONT_STACKS[themeOption.headingFont], fontWeight: themeOption.headingFont === 'heavy' ? 400 : 700 }}
                      >
                        Aa
                      </motion.div>
                      <div className="mt-4 text-sm text-muted">{FONT_LABELS[themeOption.headingFont]} · Inter</div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="w-full max-w-md space-y-2.5">
                      {[40, 100, 70, 100].map((w, i) => (
                        <motion.div
                          key={i}
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: `${w}%`, opacity: 1 }}
                          transition={{ delay: i * 0.15, duration: 0.5 }}
                          className={cn('rounded-lg', i === 1 ? 'h-24' : 'h-5')}
                          style={{ background: i === 1 ? `${logo.palette.primary}55` : '#1c2848' }}
                        />
                      ))}
                      <div className="grid grid-cols-4 gap-2.5 pt-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="aspect-[4/5] rounded-lg bg-surface-3"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {step === 4 && (
                    <motion.div initial={{ filter: 'blur(12px)' }} animate={{ filter: 'blur(0px)' }} transition={{ duration: 1 }} className="w-full max-w-lg">
                      <MiniStorefront logo={logo} theme={themeOption} storeName={profile.storeName} className="aspect-[16/10] w-full rounded-xl border border-line" />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Checklist */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-fg">Creating your brand experience…</h1>
              <p className="mt-2 text-muted">
                Brandora is turning the <span className="text-fg">{logo.name}</span> logo into a complete{' '}
                <span className="text-fg">{themeOption.name}</span> storefront.
              </p>
              <ol className="mt-8 space-y-4">
                {STEPS.map((s, i) => {
                  const state = i < step ? 'done' : i === step ? 'active' : 'todo'
                  return (
                    <motion.li
                      key={s.label}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3.5"
                    >
                      <span
                        className={cn(
                          'grid size-9 place-items-center rounded-xl transition-colors duration-300',
                          state === 'done' && 'gold-gradient text-gold-ink',
                          state === 'active' && 'border border-gold bg-gold/10 text-gold',
                          state === 'todo' && 'border border-line text-dim',
                        )}
                      >
                        {state === 'done' ? (
                          <Check className="size-4" strokeWidth={3} />
                        ) : state === 'active' ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <s.icon className="size-4" />
                        )}
                      </span>
                      <span className={cn('text-[15px] font-medium transition-colors', state === 'todo' ? 'text-dim' : 'text-fg')}>{s.label}</span>
                    </motion.li>
                  )
                })}
              </ol>
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-xs text-muted">
                  <span>Progress</span>
                  <span className="font-semibold text-fg">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <motion.div className="h-full rounded-full gold-gradient" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-semibold text-success"
            >
              <Check className="size-4" /> Theme generated
            </motion.div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-fg">Your store is ready</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              We built a {themeOption.name.toLowerCase()} storefront using the {logo.paletteName.toLowerCase()} palette from your logo.
            </p>
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2">
              {swatches.map((s) => (
                <span key={s.label} className="h-8 flex-1 rounded-lg border border-white/10" style={{ background: s.hex }} title={s.label} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-line-strong shadow-2xl"
            >
              <MiniStorefront logo={logo} theme={themeOption} storeName={profile.storeName} className="aspect-[16/9] w-full" />
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => navigate('/business/theme')}>
                Try another theme
              </Button>
              <Button size="lg" onClick={() => navigate('/business/preview')}>
                Preview my store <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="mt-6 flex justify-center opacity-70">
              <LogoMark logo={logo} name={profile.storeName} size={26} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
