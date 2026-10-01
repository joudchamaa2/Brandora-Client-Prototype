import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Image, LayoutTemplate, MousePointerClick, Palette, RotateCcw, ShoppingBag, Sparkles, Type, UploadCloud } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { inputClass } from '../../../components/business/DashboardUI'
import { BrowserFrame, storeSlug, usePreviewProducts } from '../../../components/business/previewHelpers'
import { StorefrontPreview } from '../../../components/business/StorefrontPreview'
import { Button } from '../../../components/shared/Button'
import { LogoSymbol } from '../../../components/visuals/LogoMark'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import { LOGOS } from '../../../data/logos'
import { FONT_LABELS, THEMES } from '../../../data/themes'
import type { ButtonShape, FontKey, HeroStyle } from '../../../data/types'
import { FONT_STACKS } from '../../../lib/storeTheme'
import { cn } from '../../../lib/utils'

const PRESET_COLORS = ['#E8B948', '#8B5CF6', '#E5484D', '#10B981', '#38BDF8', '#E879A6', '#F97316', '#F5F5F4']
const HERO_LAYOUTS: { value: HeroStyle; label: string }[] = [
  { value: 'centered', label: 'Centered' },
  { value: 'split', label: 'Split' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'banner', label: 'Banner' },
]
const BUTTONS: { value: ButtonShape; label: string; radius: number }[] = [
  { value: 'square', label: 'Square', radius: 2 },
  { value: 'rounded', label: 'Rounded', radius: 10 },
  { value: 'pill', label: 'Pill', radius: 999 },
]

function Section({ title, icon, children, open, onToggle }: { title: string; icon: ReactNode; children: ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line last:border-0">
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-semibold text-fg hover:bg-surface-2/40">
        <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-gold">{icon}</span>
        <span className="flex-1">{title}</span>
        <ChevronDown className={cn('size-4 text-dim transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-[13px] text-fg">
      {label}
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn('relative h-6 w-11 rounded-full transition-colors', on ? 'bg-gold' : 'bg-surface-3')}
      >
        <motion.span layout className={cn('absolute top-1 size-4 rounded-full bg-white', on ? 'right-1' : 'left-1')} />
      </button>
    </label>
  )
}

export function BuilderPage() {
  const biz = useBusiness()
  const { toast } = useToast()
  const products = usePreviewProducts()
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [openSection, setOpenSection] = useState<string>('logo')
  const b = biz.builder
  const t = biz.storeTheme

  const sec = (id: string) => ({ open: openSection === id, onToggle: () => setOpenSection(openSection === id ? '' : id) })

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-[28px]">Website Builder</h1>
          <p className="mt-1 text-sm text-muted">Customize your storefront — every change previews live.</p>
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            icon={<RotateCcw className="size-4" />}
            onClick={() => {
              biz.resetBuilder()
              toast({ title: 'Content reset', description: 'Hero, sections and styles restored to defaults.', tone: 'info' })
            }}
          >
            Reset
          </Button>
          <Button icon={<UploadCloud className="size-4" />} onClick={() => toast({ title: 'Storefront published', description: `${storeSlug(biz.profile.storeName)}.brandora.store is up to date.` })}>
            Publish changes
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="card-surface h-fit overflow-hidden rounded-3xl xl:sticky xl:top-0">
          <div className="border-b border-line px-5 py-4">
            <div className="text-[15px] font-semibold text-fg">Customize your storefront</div>
            <div className="text-xs text-muted">Theme & content settings</div>
          </div>

          <Section title="Logo" icon={<Image className="size-4" />} {...sec('logo')}>
            <div className="grid grid-cols-3 gap-2">
              {LOGOS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => biz.setLogoId(l.id)}
                  className={cn(
                    'relative grid place-items-center rounded-xl border p-3 transition-colors',
                    biz.logoId === l.id ? 'border-gold bg-gold/8' : 'border-line hover:border-line-strong',
                  )}
                  style={{ background: biz.logoId === l.id ? undefined : l.palette.dark }}
                  title={l.name}
                >
                  <LogoSymbol logo={l} name={biz.profile.storeName} size={36} />
                  <span className="mt-1.5 text-[11px] text-muted">{l.name}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Theme" icon={<LayoutTemplate className="size-4" />} {...sec('theme')}>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => biz.setThemeId(th.id)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-left transition-colors',
                    biz.themeId === th.id ? 'border-gold bg-gold/8' : 'border-line hover:border-line-strong',
                  )}
                >
                  <div className="text-[13px] font-semibold text-fg">{th.name}</div>
                  <div className="text-[11px] text-muted">{th.mode === 'dark' ? 'Dark' : 'Light'} · {th.heroStyle}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Colors" icon={<Palette className="size-4" />} {...sec('colors')}>
            <div className="text-xs text-muted">Primary color {b.primary ? '(custom)' : `(from ${biz.logo.name} logo)`}</div>
            <div className="flex flex-wrap gap-2">
              {[biz.logo.palette.primary, ...PRESET_COLORS.filter((c) => c !== biz.logo.palette.primary)].map((c, i) => {
                const active = t.primary.toLowerCase() === c.toLowerCase()
                return (
                  <button
                    key={c}
                    onClick={() => biz.updateBuilder({ primary: i === 0 ? undefined : c })}
                    className={cn('relative grid size-9 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition', active ? 'ring-gold' : 'ring-transparent')}
                    style={{ background: c }}
                    aria-label={`Use ${c}`}
                  >
                    {active && <Check className="size-4 text-black/70" strokeWidth={3} />}
                  </button>
                )
              })}
              <label className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-line-strong text-dim" title="Custom color">
                <Sparkles className="size-4" />
                <input type="color" value={t.primary} onChange={(e) => biz.updateBuilder({ primary: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
              </label>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-bg-2 p-2.5">
              {[t.bg, t.surface, t.primary, t.text].map((c, i) => (
                <span key={i} className="h-6 flex-1 rounded-md border border-white/10" style={{ background: c }} />
              ))}
            </div>
          </Section>

          <Section title="Typography" icon={<Type className="size-4" />} {...sec('type')}>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FONT_LABELS) as FontKey[]).map((f) => {
                const active = (b.headingFont ?? biz.themeOption.headingFont) === f
                return (
                  <button
                    key={f}
                    onClick={() => biz.updateBuilder({ headingFont: f })}
                    className={cn('rounded-xl border px-3 py-2.5 text-left transition-colors', active ? 'border-gold bg-gold/8' : 'border-line hover:border-line-strong')}
                  >
                    <div className="text-2xl leading-none text-fg" style={{ fontFamily: FONT_STACKS[f], fontWeight: f === 'heavy' ? 400 : 700 }}>
                      Aa
                    </div>
                    <div className="mt-1 text-[11px] text-muted">{FONT_LABELS[f]}</div>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="Hero" icon={<Sparkles className="size-4" />} {...sec('hero')}>
            <div className="grid grid-cols-4 gap-1.5">
              {HERO_LAYOUTS.map((h) => (
                <button
                  key={h.value}
                  onClick={() => biz.updateBuilder({ heroStyle: h.value })}
                  className={cn(
                    'rounded-lg border py-2 text-[11px] font-semibold transition-colors',
                    t.heroStyle === h.value ? 'border-gold bg-gold/8 text-gold' : 'border-line text-muted hover:text-fg',
                  )}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <input value={b.heroTitle} onChange={(e) => biz.updateBuilder({ heroTitle: e.target.value })} className={inputClass} placeholder="Headline" />
            <textarea
              value={b.heroSubtitle}
              onChange={(e) => biz.updateBuilder({ heroSubtitle: e.target.value })}
              rows={3}
              className={cn(inputClass, 'h-auto resize-none py-2.5')}
              placeholder="Subheadline"
            />
            <input value={b.heroCta} onChange={(e) => biz.updateBuilder({ heroCta: e.target.value })} className={inputClass} placeholder="Button label" />
            <input value={b.announcement} onChange={(e) => biz.updateBuilder({ announcement: e.target.value })} className={inputClass} placeholder="Announcement bar (leave empty to hide)" />
          </Section>

          <Section title="Featured Products" icon={<ShoppingBag className="size-4" />} {...sec('products')}>
            <div className="flex items-center justify-between text-[13px] text-fg">
              Products shown <span className="font-semibold text-gold">{b.featuredCount}</span>
            </div>
            <input
              type="range"
              min={2}
              max={8}
              step={2}
              value={b.featuredCount}
              onChange={(e) => biz.updateBuilder({ featuredCount: Number(e.target.value) })}
              className="w-full accent-[#E8B948]"
            />
            <Toggle label="Show categories" on={b.showCategories} onChange={(v) => biz.updateBuilder({ showCategories: v })} />
            <Toggle label="Show newsletter promo" on={b.showPromo} onChange={(v) => biz.updateBuilder({ showPromo: v })} />
          </Section>

          <Section title="Buttons" icon={<MousePointerClick className="size-4" />} {...sec('buttons')}>
            <div className="grid grid-cols-3 gap-2">
              {BUTTONS.map((btn) => {
                const active = t.buttonRadius === btn.radius
                return (
                  <button
                    key={btn.value}
                    onClick={() => biz.updateBuilder({ buttonShape: btn.value })}
                    className={cn('rounded-xl border p-3 transition-colors', active ? 'border-gold bg-gold/8' : 'border-line hover:border-line-strong')}
                  >
                    <span className="block h-6 w-full gold-gradient" style={{ borderRadius: Math.min(btn.radius, 12) }} />
                    <span className="mt-2 block text-[11px] text-muted">{btn.label}</span>
                  </button>
                )
              })}
            </div>
          </Section>
        </motion.div>

        {/* Live preview */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="min-w-0">
          <BrowserFrame url={`${storeSlug(biz.profile.storeName)}.brandora.store`} device={device} onDeviceChange={setDevice} className="h-[calc(100dvh-64px-64px-150px)] min-h-[560px]">
            <StorefrontPreview theme={t} logo={biz.logo} storeName={biz.profile.storeName} builder={b} products={products} device={device} />
          </BrowserFrame>
        </motion.div>
      </div>
    </>
  )
}
