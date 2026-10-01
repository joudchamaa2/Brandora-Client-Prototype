import { motion } from 'framer-motion'
import { ArrowLeft, Wand2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BrowserFrame, storeSlug, usePreviewProducts } from '../../../components/business/previewHelpers'
import { StorefrontPreview } from '../../../components/business/StorefrontPreview'
import { ThemeCard } from '../../../components/business/ThemeCard'
import { Button } from '../../../components/shared/Button'
import { LogoSymbol } from '../../../components/visuals/LogoMark'
import { useBusiness } from '../../../context/BusinessContext'
import { THEMES } from '../../../data/themes'

export function ThemePage() {
  const navigate = useNavigate()
  const biz = useBusiness()
  const products = usePreviewProducts()
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Choose your store theme</h1>
          <p className="mt-2 max-w-xl text-muted">Every theme is previewed with your logo colors. Pick a layout style — we'll tailor the rest.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5">
          <LogoSymbol logo={biz.logo} name={biz.profile.storeName} size={30} />
          <div className="text-xs">
            <div className="font-semibold text-fg">{biz.logo.name} logo</div>
            <div className="text-muted">{biz.logo.paletteName} palette</div>
          </div>
          <button onClick={() => navigate('/business/branding')} className="ml-2 text-xs font-semibold text-gold hover:underline">
            Change
          </button>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {THEMES.map((t, i) => (
          <ThemeCard
            key={t.id}
            index={i}
            theme={t}
            logo={biz.logo}
            storeName={biz.profile.storeName}
            selected={t.id === biz.themeId}
            onSelect={() => biz.setThemeId(t.id)}
          />
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-fg">
            Live preview · <span className="text-gold">{biz.themeOption.name}</span>
          </div>
        </div>
        <BrowserFrame url={`${storeSlug(biz.profile.storeName)}.brandora.store`} device={device} onDeviceChange={setDevice} className="h-[640px]">
          <StorefrontPreview
            theme={biz.storeTheme}
            logo={biz.logo}
            storeName={biz.profile.storeName}
            builder={biz.builder}
            products={products}
            device={device}
          />
        </BrowserFrame>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <Button variant="ghost" onClick={() => navigate('/business/branding')} icon={<ArrowLeft className="size-4" />}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={() => {
            biz.setGenerated(false)
            navigate('/business/generate')
          }}
          icon={<Wand2 className="size-4" />}
        >
          Generate my store
        </Button>
      </div>
    </div>
  )
}
