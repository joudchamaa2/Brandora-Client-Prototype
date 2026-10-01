import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Check, ShieldCheck, Shirt, Smartphone, Sparkles, Star, Truck } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { BrandLogo } from '../../components/shared/BrandLogo'
import { Button } from '../../components/shared/Button'
import { cn } from '../../lib/utils'

/* --------------------------- slide illustrations --------------------------- */

function StoresArt() {
  const cards = [
    { icon: Shirt, name: 'Nova Streetwear', rot: -10, x: -78, y: 18 },
    { icon: Smartphone, name: 'TechHub', rot: 9, x: 78, y: 22 },
    { icon: Sparkles, name: 'Luxe Atelier', rot: 0, x: 0, y: 0 },
  ]
  return (
    <div className="relative h-56 w-full">
      {cards.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: c.y, rotate: c.rot, x: c.x }}
          transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 160, damping: 18 }}
          className="card-surface absolute left-1/2 top-4 -ml-[70px] w-[140px] rounded-2xl p-2.5"
        >
          <div className="grid h-20 place-items-center rounded-xl bg-gradient-to-br from-surface-3 to-bg-2">
            <c.icon className="size-8 text-gold" strokeWidth={1.5} />
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-fg">
            {c.name} <ShieldCheck className="size-3 text-gold" />
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted">
            <Star className="size-2.5 fill-gold text-gold" /> 4.8
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function WholesaleArt() {
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail')
  return (
    <div className="flex h-56 flex-col items-center justify-center gap-5">
      <div className="flex rounded-full border border-line bg-surface p-1">
        {(['retail', 'wholesale'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn('relative rounded-full px-5 py-2 text-xs font-semibold capitalize', mode === m ? 'text-gold-ink' : 'text-muted')}
          >
            {mode === m && <motion.span layoutId="intro-toggle" className="absolute inset-0 rounded-full gold-gradient" />}
            <span className="relative">{m}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="text-center"
        >
          <div className="font-display text-5xl font-bold text-gold">{mode === 'retail' ? '$89' : '$62'}</div>
          <div className="mt-2 text-xs text-muted">{mode === 'retail' ? 'per piece' : 'per piece · min. 12 pcs'}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function DeliveryArt() {
  const steps = ['Order accepted', 'Out for delivery', 'Delivered']
  return (
    <div className="mx-auto flex h-56 w-56 flex-col justify-center gap-4">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.18 }}
          className="flex items-center gap-3"
        >
          <div className={cn('grid size-10 place-items-center rounded-full', i < 2 ? 'gold-gradient text-gold-ink' : 'border border-line bg-surface text-dim')}>
            {i === 0 ? <Check className="size-4" /> : i === 1 ? <Truck className="size-4" /> : <ShieldCheck className="size-4" />}
          </div>
          <span className={cn('text-sm font-medium', i < 2 ? 'text-fg' : 'text-dim')}>{s}</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="mt-1 flex items-center gap-2 self-start rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[11px] font-semibold text-gold"
      >
        <Banknote className="size-3.5" /> Cash on delivery
      </motion.div>
    </div>
  )
}

const SLIDES: { title: string; body: string; art: ReactNode }[] = [
  {
    title: 'Discover verified stores',
    body: 'Fashion, beauty, electronics and home — curated local brands, all in one place.',
    art: <StoresArt />,
  },
  {
    title: 'Retail or wholesale',
    body: 'Buy a single piece or order in bulk at wholesale prices from the same store.',
    art: <WholesaleArt />,
  },
  {
    title: 'Delivered to your door',
    body: 'Pay cash on delivery and follow your order live, from the store to your door.',
    art: <DeliveryArt />,
  },
]

export function IntroScreen() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const last = index === SLIDES.length - 1

  const go = (next: number) => {
    if (next < 0 || next >= SLIDES.length) return
    setDir(next > index ? 1 : -1)
    setIndex(next)
  }

  const finish = () => navigate('/customer/category')

  return (
    <div className="flex h-full flex-col px-6 pb-8">
      <div className="flex h-12 items-center justify-between">
        <BrandLogo size="sm" />
        {!last && (
          <button onClick={finish} className="text-sm font-medium text-muted hover:text-fg">
            Skip
          </button>
        )}
      </div>

      <div className="relative flex flex-1 flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1)
              if (info.offset.x > 60) go(index - 1)
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            {SLIDES[index].art}
            <h1 className="mt-6 text-center text-[26px] font-bold leading-tight tracking-tight text-fg">{SLIDES[index].title}</h1>
            <p className="mx-auto mt-3 max-w-[290px] text-center text-[15px] leading-relaxed text-muted">{SLIDES[index].body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: i === index ? 26 : 8, background: i === index ? '#E8B948' : '#2a3860' }}
          />
        ))}
      </div>
      <Button size="lg" block onClick={() => (last ? finish() : go(index + 1))}>
        {last ? 'Get started' : 'Next'}
      </Button>
    </div>
  )
}
