import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { BrandLogo } from '../../components/shared/BrandLogo'

const SPLASH_MS = 2900

export function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/customer/intro', { replace: true }), SPLASH_MS)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <button
      onClick={() => navigate('/customer/intro', { replace: true })}
      className="relative flex h-full w-full cursor-default flex-col items-center justify-center overflow-hidden bg-bg"
      aria-label="Skip splash"
    >
      {/* gold glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,185,72,0.16), transparent 62%)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1.4, ease: 'easeOut' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <BrandLogo size="xl" animated tagline />
      </motion.div>

      {/* gold underline sweep */}
      <motion.div
        className="relative mt-8 h-px w-40 origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, #E8B948, transparent)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* loading bar */}
      <div className="absolute bottom-16 h-[3px] w-24 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full gold-gradient"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.3, duration: SPLASH_MS / 1000 - 0.4, ease: 'easeInOut' }}
        />
      </div>
    </button>
  )
}
