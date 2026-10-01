import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { BusinessSidebar } from '../components/business/BusinessSidebar'
import { BusinessTopbar } from '../components/business/BusinessTopbar'
import { FrozenOutlet, fadeVariants } from '../components/shared/PageTransition'
import { ToastViewport } from '../components/shared/ToastViewport'

/** Desktop-first store admin shell: sidebar + top bar + animated content area */
export function BusinessDashboardLayout() {
  const { pathname } = useLocation()
  const [mobileNav, setMobileNav] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileNav(false)
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-[calc(100dvh-64px)] min-h-0">
      <BusinessSidebar className="hidden lg:flex" />

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
            <motion.div
              className="absolute inset-y-0 left-0"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            >
              <BusinessSidebar className="flex h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <BusinessTopbar onMenu={() => setMobileNav(true)} />
        <main ref={mainRef} className="thin-scrollbar relative min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              variants={fadeVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
            >
              <FrozenOutlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ToastViewport placement="desktop" />
    </div>
  )
}
