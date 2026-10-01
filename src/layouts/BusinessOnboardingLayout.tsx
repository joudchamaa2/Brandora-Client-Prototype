import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { StepIndicator } from '../components/business/StepIndicator'
import { FrozenOutlet, fadeVariants } from '../components/shared/PageTransition'
import { ToastViewport } from '../components/shared/ToastViewport'

const STEP_BY_PATH: Record<string, number> = {
  '/business/onboarding': 0,
  '/business/plans': 1,
  '/business/payment': 1,
  '/business/branding': 2,
  '/business/theme': 3,
  '/business/generate': 3,
  '/business/preview': 4,
  '/business/submitted': 5,
}

/** Wizard shell for "become a Brandora store" */
export function BusinessOnboardingLayout() {
  const { pathname } = useLocation()
  const step = STEP_BY_PATH[pathname] ?? 0

  // Each wizard step starts at the top of the page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-line/50 bg-bg-2/40 py-5">
        <StepIndicator current={step} />
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pathname} variants={fadeVariants} initial="initial" animate="enter" exit="exit" className="h-full">
            <FrozenOutlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <ToastViewport placement="desktop" />
    </div>
  )
}
