import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, AtSign, Heart, Menu, Search, ShoppingBag, Star } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import type { LogoOption, ProductKind } from '../../data/types'
import { alpha } from '../../lib/color'
import type { BuilderSettings, StoreTheme } from '../../lib/storeTheme'
import { cn } from '../../lib/utils'
import { LogoMark } from '../visuals/LogoMark'
import { ProductArt } from '../visuals/ProductArt'

export interface PreviewProduct {
  name: string
  price: number
  kind: ProductKind
  color: string
}

interface Props {
  theme: StoreTheme
  logo: LogoOption
  storeName: string
  builder: BuilderSettings
  products: PreviewProduct[]
  /** "mobile" forces the single-column layout regardless of available width */
  device?: 'desktop' | 'mobile'
  className?: string
}

const CATEGORIES: { label: string; kind: ProductKind; color: string }[] = [
  { label: 'Outerwear', kind: 'jacket', color: '#23262f' },
  { label: 'Bottoms', kind: 'pants', color: '#5d6b3a' },
  { label: 'Tees', kind: 'tee', color: '#ece4d4' },
  { label: 'Hoodies', kind: 'hoodie', color: '#9a958c' },
]

/**
 * Fully themed storefront. Every color, font, radius and layout choice comes from
 * the generated StoreTheme so changing the logo or theme re-skins the whole page.
 * Uses container queries so it adapts to the frame it is rendered in.
 */
export function StorefrontPreview({ theme: t, logo, storeName, builder, products, device = 'desktop', className }: Props) {
  const mobile = device === 'mobile'
  const featured = products.slice(0, builder.featuredCount)

  const heading = (size: string, extra: CSSProperties = {}): CSSProperties => ({
    fontFamily: t.headingFont,
    fontWeight: t.headingWeight,
    letterSpacing: t.tracking,
    textTransform: t.uppercase ? 'uppercase' : 'none',
    fontSize: size,
    lineHeight: 1.05,
    color: 'inherit',
    ...extra,
  })

  const primaryBtn: CSSProperties = {
    background: t.primary,
    color: t.onPrimary,
    borderRadius: t.buttonRadius,
    fontWeight: 600,
  }
  const outlineBtn: CSSProperties = {
    border: `1.5px solid ${t.heroStyle === 'banner' ? t.heroText : t.text}`,
    color: t.heroStyle === 'banner' ? t.heroText : t.text,
    borderRadius: t.buttonRadius,
    fontWeight: 600,
  }

  const artBg = t.mode === 'dark' ? `linear-gradient(160deg, ${t.surface2}, ${t.bg})` : `linear-gradient(160deg, ${t.surface2}, ${t.surface})`

  const card = (children: ReactNode, key: string) => (
    <motion.div
      key={key}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col overflow-hidden"
      style={{
        background: t.cardStyle === 'flat' ? 'transparent' : t.surface,
        border: t.cardStyle === 'bordered' ? `1px solid ${t.border}` : 'none',
        borderRadius: t.radius,
        boxShadow: t.cardShadow,
      }}
    >
      {children}
    </motion.div>
  )

  return (
    <div
      className={cn('storefront @container w-full overflow-hidden text-left', className)}
      style={{ background: t.bg, color: t.text, fontFamily: t.bodyFont }}
    >
      {/* Announcement */}
      {builder.announcement && (
        <div className="px-4 py-2 text-center text-[11px] font-semibold tracking-wide" style={{ background: t.primary, color: t.onPrimary }}>
          {builder.announcement}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex items-center gap-4 px-5 py-4 @2xl:px-10" style={{ borderBottom: `1px solid ${t.border}` }}>
        <Menu className={cn('size-5', !mobile && '@2xl:hidden')} style={{ color: t.text }} />
        <LogoMark logo={logo} name={storeName} size={30} primary={t.primary} on={t.mode} />
        <div className={cn('ml-6 hidden gap-6 text-[13px] font-medium', !mobile && '@2xl:flex')} style={{ color: t.muted }}>
          <span style={{ color: t.text }}>Shop</span>
          <span>New in</span>
          <span>Collections</span>
          <span>About</span>
        </div>
        <div className="ml-auto flex items-center gap-4" style={{ color: t.text }}>
          <Search className="size-[18px]" />
          <Heart className={cn('size-[18px]', mobile ? 'hidden' : 'hidden @md:block')} />
          <div className="relative">
            <ShoppingBag className="size-[18px]" />
            <span
              className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full text-[9px] font-bold"
              style={{ background: t.primary, color: t.onPrimary }}
            >
              2
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <AnimatePresence mode="wait">
        <motion.section
          key={t.heroStyle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden"
          style={{ background: t.heroBg, color: t.heroText }}
        >
          {t.heroStyle === 'centered' && (
            <div className="relative px-6 py-14 text-center @2xl:py-20">
              <div
                className="pointer-events-none absolute left-1/2 top-0 size-[420px] -translate-x-1/2 rounded-full"
                style={{ background: `radial-gradient(circle, ${alpha(t.primary, 0.18)}, transparent 65%)` }}
              />
              <div className="relative text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color: t.primary }}>
                New collection · 2026
              </div>
              <h2 className="relative mx-auto mt-4 max-w-[640px]" style={heading(mobile ? '30px' : 'clamp(30px, 6cqw, 54px)')}>
                {builder.heroTitle}
              </h2>
              <p className="relative mx-auto mt-4 max-w-[460px] text-[13px] leading-relaxed" style={{ color: t.muted }}>
                {builder.heroSubtitle}
              </p>
              <div className="relative mt-7 flex flex-wrap justify-center gap-3">
                <span className="px-6 py-3 text-[13px]" style={primaryBtn}>
                  {builder.heroCta}
                </span>
                <span className="px-6 py-3 text-[13px]" style={outlineBtn}>
                  Lookbook
                </span>
              </div>
              <div className="relative mx-auto mt-10 grid max-w-[560px] grid-cols-3 gap-3">
                {products.slice(0, 3).map((p) => (
                  <ProductArt key={p.name} kind={p.kind} color={p.color} background={artBg} accent={t.primary} className="aspect-square" rounded="" scale={0.66} />
                ))}
              </div>
            </div>
          )}

          {t.heroStyle === 'split' && (
            <div className={cn('grid items-center gap-8 px-6 py-12', !mobile && '@2xl:grid-cols-2 @2xl:px-10 @2xl:py-16')}>
              <div>
                <span
                  className="inline-block px-3 py-1 text-[11px] font-semibold"
                  style={{ background: t.primarySoft, color: t.primary, borderRadius: t.buttonRadius }}
                >
                  New season drop
                </span>
                <h2 className="mt-4" style={heading(mobile ? '30px' : 'clamp(30px, 5cqw, 50px)')}>
                  {builder.heroTitle}
                </h2>
                <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed" style={{ color: t.muted }}>
                  {builder.heroSubtitle}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-5 py-3 text-[13px]" style={primaryBtn}>
                    {builder.heroCta} <ArrowRight className="size-4" />
                  </span>
                  <span className="px-5 py-3 text-[13px]" style={outlineBtn}>
                    Explore
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[12px]" style={{ color: t.muted }}>
                  <Star className="size-3.5" style={{ color: t.primary, fill: t.primary }} /> 4.8 · 214 reviews on Brandora
                </div>
              </div>
              <div className="relative">
                <div
                  className="absolute inset-6 rounded-full blur-3xl"
                  style={{ background: alpha(t.primary, t.mode === 'dark' ? 0.25 : 0.18) }}
                />
                <ProductArt
                  kind={products[0]?.kind ?? 'jacket'}
                  color={products[0]?.color ?? '#23262f'}
                  background={artBg}
                  accent={t.primary}
                  className="relative aspect-[5/4] w-full"
                  rounded=""
                  scale={0.7}
                />
              </div>
            </div>
          )}

          {t.heroStyle === 'editorial' && (
            <div className={cn('grid gap-6 px-6 py-12', !mobile && '@2xl:grid-cols-[1.2fr_1fr] @2xl:px-10 @2xl:py-16')}>
              <div className="flex flex-col justify-end">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: t.primary }}>
                  Issue 04 — Fall / Winter
                </div>
                <h2 className="mt-4" style={heading(mobile ? '40px' : 'clamp(40px, 8cqw, 84px)', { lineHeight: 0.95, fontStyle: 'italic' })}>
                  {builder.heroTitle}
                </h2>
                <div className="mt-6 flex items-center gap-4">
                  <span className="px-6 py-3 text-[13px]" style={primaryBtn}>
                    {builder.heroCta}
                  </span>
                  <span className="text-[12px] underline underline-offset-4" style={{ color: t.muted }}>
                    Read the story
                  </span>
                </div>
              </div>
              <div className="relative">
                <ProductArt
                  kind={products[1]?.kind ?? 'pants'}
                  color={products[1]?.color ?? '#5d6b3a'}
                  background={artBg}
                  accent={t.primary}
                  className="aspect-[3/4] w-full"
                  rounded=""
                  scale={0.72}
                />
                <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.muted }}>
                  {builder.heroSubtitle}
                </p>
              </div>
            </div>
          )}

          {t.heroStyle === 'banner' && (
            <div className={cn('relative grid items-center gap-6 px-6 py-12', !mobile && '@2xl:grid-cols-[1.3fr_1fr] @2xl:px-10 @2xl:py-14')}>
              <div>
                <h2 style={heading(mobile ? '34px' : 'clamp(34px, 7cqw, 72px)', { lineHeight: 0.92 })}>{builder.heroTitle}</h2>
                <p className="mt-4 max-w-[420px] text-[13px] font-medium leading-relaxed" style={{ opacity: 0.85 }}>
                  {builder.heroSubtitle}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span
                    className="px-6 py-3 text-[13px]"
                    style={{ background: t.heroText, color: t.primary, borderRadius: t.buttonRadius, fontWeight: 700 }}
                  >
                    {builder.heroCta}
                  </span>
                  <span className="px-6 py-3 text-[13px]" style={outlineBtn}>
                    New arrivals
                  </span>
                </div>
              </div>
              <div className="relative">
                <ProductArt
                  kind={products[3]?.kind ?? 'hoodie'}
                  color={products[3]?.color ?? '#3c4150'}
                  background={alpha('#000000', 0.12)}
                  accent={t.heroText}
                  className="aspect-square w-full"
                  rounded=""
                  scale={0.72}
                />
                <div
                  className="absolute -left-2 top-4 -rotate-12 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider"
                  style={{ background: t.heroText, color: t.primary, borderRadius: t.buttonRadius }}
                >
                  New drop
                </div>
              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* Categories */}
      {builder.showCategories && (
        <section className="px-5 pt-10 @2xl:px-10">
          <h3 style={heading('18px')}>Shop by category</h3>
          <div className={cn('mt-4 grid grid-cols-2 gap-3', !mobile && '@2xl:grid-cols-4')}>
            {CATEGORIES.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 p-2.5"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius }}
              >
                <ProductArt kind={c.kind} color={c.color} background={artBg} accent={t.primary} className="size-11 shrink-0" rounded="" scale={0.75} />
                <span className="text-[12.5px] font-semibold">{c.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="px-5 py-10 @2xl:px-10">
        <div className="flex items-end justify-between">
          <h3 style={heading('20px')}>Featured products</h3>
          <span className="text-[12px] font-semibold" style={{ color: t.primary }}>
            View all →
          </span>
        </div>
        <div className={cn('mt-5 grid grid-cols-2 gap-4', !mobile && '@2xl:grid-cols-4')}>
          <AnimatePresence initial={false}>
            {featured.map((p) =>
              card(
                <>
                  <ProductArt
                    kind={p.kind}
                    color={p.color}
                    background={artBg}
                    accent={t.primary}
                    className="aspect-[4/5] w-full"
                    rounded=""
                    scale={0.68}
                  />
                  <div className="p-3">
                    <div className="truncate text-[12.5px] font-semibold">{p.name}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[13px] font-bold" style={{ color: t.primary }}>
                        ${p.price}
                      </span>
                      <span
                        className="grid size-7 place-items-center"
                        style={{ background: t.primarySoft, color: t.primary, borderRadius: t.buttonRadius }}
                      >
                        <ShoppingBag className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </>,
                p.name,
              ),
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Promo / newsletter */}
      {builder.showPromo && (
        <section className="px-5 pb-10 @2xl:px-10">
          <div
            className={cn('flex flex-col gap-4 p-6', !mobile && '@2xl:flex-row @2xl:items-center @2xl:justify-between @2xl:p-8')}
            style={{ background: t.mode === 'dark' ? t.surface2 : t.primary, color: t.mode === 'dark' ? t.text : t.onPrimary, borderRadius: t.radius }}
          >
            <div>
              <h3 style={heading('22px')}>Join the {storeName.split(' ')[0]} club</h3>
              <p className="mt-1.5 text-[12.5px]" style={{ opacity: 0.75 }}>
                Get 10% off your first order and early access to new drops.
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className="flex-1 px-4 py-2.5 text-[12px] @2xl:w-56"
                style={{
                  background: t.mode === 'dark' ? t.bg : alpha('#ffffff', 0.9),
                  color: t.mode === 'dark' ? t.muted : '#666',
                  borderRadius: t.buttonRadius,
                }}
              >
                Your email
              </span>
              <span
                className="px-4 py-2.5 text-[12px] font-semibold"
                style={
                  t.mode === 'dark'
                    ? primaryBtn
                    : { background: t.text, color: t.bg, borderRadius: t.buttonRadius, fontWeight: 600 }
                }
              >
                Subscribe
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-5 py-8 @2xl:px-10" style={{ borderTop: `1px solid ${t.border}`, background: t.mode === 'dark' ? t.bg : t.surface2 }}>
        <div className={cn('grid gap-6', !mobile && '@2xl:grid-cols-[1.5fr_1fr_1fr_1fr]')}>
          <div>
            <LogoMark logo={logo} name={storeName} size={26} primary={t.primary} on={t.mode} />
            <p className="mt-3 max-w-[240px] text-[11.5px] leading-relaxed" style={{ color: t.muted }}>
              Delivered across Lebanon. Cash on delivery available on every order.
            </p>
            <AtSign className="mt-3 size-4" style={{ color: t.muted }} />
          </div>
          {[
            ['Shop', 'New in', 'Bestsellers', 'Sale'],
            ['Help', 'Delivery', 'Returns', 'Contact'],
            ['About', 'Our story', 'Stores', 'Wholesale'],
          ].map(([title, ...links]) => (
            <div key={title} className={cn('text-[11.5px]', mobile ? 'hidden' : 'hidden @2xl:block')}>
              <div className="mb-2 font-semibold">{title}</div>
              {links.map((l) => (
                <div key={l} className="py-0.5" style={{ color: t.muted }}>
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between pt-4 text-[10.5px]" style={{ borderTop: `1px solid ${t.border}`, color: t.muted }}>
          <span>© 2026 {storeName}</span>
          <span>Powered by Brandora</span>
        </div>
      </footer>
    </div>
  )
}
