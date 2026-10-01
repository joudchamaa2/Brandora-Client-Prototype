import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BrowserFrame, storeSlug, usePreviewProducts } from '../../../components/business/previewHelpers'
import { StorefrontPreview } from '../../../components/business/StorefrontPreview'
import { Button } from '../../../components/shared/Button'
import { LogoSymbol } from '../../../components/visuals/LogoMark'
import { useBusiness } from '../../../context/BusinessContext'
import { LOGOS } from '../../../data/logos'
import { THEMES } from '../../../data/themes'
import { cn } from '../../../lib/utils'

export function PreviewPage() {
  const navigate = useNavigate()
  const biz = useBusiness()
  const products = usePreviewProducts()
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Your Store Preview</h1>
          <p className="mt-2 text-muted">Switch the logo or theme — the storefront updates instantly.</p>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="card-surface flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-dim">Logo</span>
            <div className="flex gap-1.5">
              {LOGOS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => biz.setLogoId(l.id)}
                  title={l.name}
                  className={cn(
                    'rounded-xl p-1 ring-2 transition-all',
                    biz.logoId === l.id ? 'ring-gold' : 'ring-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <LogoSymbol logo={l} name={biz.profile.storeName} size={28} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-dim">Theme</span>
            <div className="flex flex-wrap gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => biz.setThemeId(t.id)}
                  className={cn(
                    'relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    biz.themeId === t.id ? 'text-gold-ink' : 'text-muted hover:text-fg',
                  )}
                >
                  {biz.themeId === t.id && <motion.span layoutId="preview-theme" className="absolute inset-0 rounded-lg gold-gradient" />}
                  <span className="relative">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BrowserFrame url={`${storeSlug(biz.profile.storeName)}.brandora.store`} device={device} onDeviceChange={setDevice} className="mt-4 h-[68dvh] min-h-[520px]">
        <StorefrontPreview
          theme={biz.storeTheme}
          logo={biz.logo}
          storeName={biz.profile.storeName}
          builder={biz.builder}
          products={products}
          device={device}
        />
      </BrowserFrame>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <Button variant="ghost" onClick={() => navigate('/business/theme')} icon={<ArrowLeft className="size-4" />}>
          Back
        </Button>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted md:inline">You can keep editing later in the Website Builder.</span>
          <Button
            size="lg"
            icon={<Send className="size-4" />}
            onClick={() => {
              biz.setSubmitted(true)
              navigate('/business/submitted')
            }}
          >
            Submit store
          </Button>
        </div>
      </div>
    </div>
  )
}
