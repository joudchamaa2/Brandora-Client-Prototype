import { motion, type Variants } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { useOutlet } from 'react-router'
import { cn } from '../../lib/utils'

export const pageVariants: Variants = {
  initial: { opacity: 0, x: 18 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -14, transition: { duration: 0.16, ease: 'easeIn' } },
}

export const fadeVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

/** Wraps a route screen with the standard fade + slight slide animation */
export function PageTransition({
  children,
  className,
  variant = 'slide',
}: {
  children: ReactNode
  className?: string
  variant?: 'slide' | 'fade'
}) {
  return (
    <motion.div
      className={cn('h-full', className)}
      variants={variant === 'slide' ? pageVariants : fadeVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

/**
 * Outlet that freezes the element it rendered first. Used inside AnimatePresence so an
 * exiting route keeps showing its own content while the next route animates in.
 */
export function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

/** Staggered list container + item variants */
export const listContainer: Variants = {
  initial: {},
  enter: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export const listItem: Variants = {
  initial: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}
