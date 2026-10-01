import { motion } from 'framer-motion'
import { Lock, Monitor, RotateCw, Smartphone } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useBusiness } from '../../context/BusinessContext'
import type { LogoOption, ThemeOption } from '../../data/types'
import { buildStoreTheme } from '../../lib/storeTheme'
import { cn } from '../../lib/utils'
import { Segmented } from '../shared/Segmented'
import { StorefrontPreview, type PreviewProduct } from './StorefrontPreview'

export const storeSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'my-store'

/** Products shown in storefront previews: the business' active catalog */
export function usePreviewProducts(): PreviewProduct[] {
  const { products } = useBusiness()
  return products
    .filter((p) => p.status === 'Active')
    .map((p) => ({ name: p.name, price: p.price, kind: p.kind, color: p.color }))
}

/** Browser chrome around a storefront preview, with an optional device toggle */
export function BrowserFrame({
  url,
  device,
  onDeviceChange,
  children,
  className,
  actions,
}: {
  url: string
  device: 'desktop' | 'mobile'
  onDeviceChange?: (d: 'desktop' | 'mobile') => void
  children: ReactNode
  className?: string
  actions?: ReactNode
}) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-2xl border border-line-strong bg-bg-2 shadow-2xl', className)}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs text-muted">
          <Lock className="size-3 shrink-0 text-success" />
          <span className="truncate">{url}</span>
          <RotateCw className="ml-auto size-3 shrink-0" />
        </div>
        {actions}
        {onDeviceChange && (
          <Segmented
            size="sm"
            value={device}
            onChange={onDeviceChange}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'mobile', label: 'Mobile' },
            ]}
          />
        )}
      </div>
      <div className="thin-scrollbar relative min-h-0 flex-1 overflow-y-auto bg-[#05070e]">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className={cn('mx-auto', device === 'mobile' ? 'my-6 w-[375px] max-w-full overflow-hidden rounded-[28px] border-[6px] border-ink' : 'w-full')}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export function DeviceIcon({ device }: { device: 'desktop' | 'mobile' }) {
  return device === 'desktop' ? <Monitor className="size-4" /> : <Smartphone className="size-4" />
}

/**
 * Renders a full-width storefront at a fixed virtual width and scales it down to fit
 * its container — used for theme thumbnails.
 */
export function MiniStorefront({
  logo,
  theme,
  storeName,
  virtualWidth = 1100,
  className,
}: {
  logo: LogoOption
  theme: ThemeOption
  storeName: string
  virtualWidth?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.25)
  const { builder } = useBusiness()
  const products = usePreviewProducts()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(el.getBoundingClientRect().width / virtualWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [virtualWidth])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} aria-hidden>
      <div className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: virtualWidth, transform: `scale(${scale})` }}>
        <StorefrontPreview
          theme={buildStoreTheme(logo, theme)}
          logo={logo}
          storeName={storeName}
          builder={{ ...builder, primary: undefined }}
          products={products}
        />
      </div>
    </div>
  )
}
