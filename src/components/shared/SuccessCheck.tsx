import { motion } from 'framer-motion'

/** Gold success badge with a drawn check mark and pulsing rings */
export function SuccessCheck({ size = 112 }: { size?: number }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-gold/50"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.8, 1.6], opacity: [0.6, 0] }}
          transition={{ delay: 0.6 + i * 0.35, duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }}
        />
      ))}
      <motion.div
        className="absolute inset-0 rounded-full gold-gradient shadow-glow"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      />
      <svg viewBox="0 0 52 52" className="relative" style={{ width: size * 0.5, height: size * 0.5 }}>
        <motion.path
          d="M14 27 L23 36 L39 18"
          fill="none"
          stroke="#1A1300"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
        />
      </svg>
    </div>
  )
}
