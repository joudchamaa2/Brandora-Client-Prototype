import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router'
import { CustomerBottomNav, TAB_PATHS } from '../components/customer/CustomerBottomNav'
import { PhoneFrame } from '../components/customer/PhoneFrame'
import { FrozenOutlet, pageVariants } from '../components/shared/PageTransition'
import { ToastViewport } from '../components/shared/ToastViewport'

/** Mobile-first customer experience rendered inside a phone frame */
export function CustomerLayout() {
  const location = useLocation()
  const showNav = TAB_PATHS.includes(location.pathname)
  const isSplash = location.pathname === '/customer' || location.pathname === '/customer/'

  return (
    <div className="flex flex-1 items-start justify-center sm:items-center sm:px-4 sm:py-6">
      <PhoneFrame hideStatus={isSplash}>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="absolute inset-0"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <FrozenOutlet />
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false}>{showNav && <CustomerBottomNav key="nav" />}</AnimatePresence>
        <ToastViewport placement="phone" />
      </PhoneFrame>
    </div>
  )
}
