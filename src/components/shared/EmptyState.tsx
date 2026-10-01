import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center px-8 py-14 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
        className="mb-5 grid size-16 place-items-center rounded-2xl border border-line bg-surface text-dim"
      >
        {icon}
      </motion.div>
      <div className="text-base font-semibold text-fg">{title}</div>
      <p className="mt-1.5 max-w-[260px] text-sm leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
