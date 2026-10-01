import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

function StatusBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-20 flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold text-fg"
    >
      <span className="w-12">9:41</span>
      <div className="flex w-12 items-center justify-end gap-1.5">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        {/* battery */}
        <div className="relative h-[11px] w-[22px] rounded-[3px] border border-fg/60 p-[1.5px]">
          <div className="h-full w-[78%] rounded-[1.5px] bg-fg" />
          <div className="absolute -right-[3px] top-1/2 h-1 w-[2px] -translate-y-1/2 rounded-r-sm bg-fg/60" />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Phone-style container. On desktop it renders a device bezel centered on the page;
 * on real phones (narrow screens) it becomes a full-screen app.
 */
export function PhoneFrame({ children, hideStatus }: { children: ReactNode; hideStatus?: boolean }) {
  return (
    <div className="relative h-[calc(100dvh-64px)] w-full sm:h-[min(860px,calc(100dvh-64px-48px))] sm:min-h-[640px] sm:w-[400px] sm:rounded-[56px] sm:bg-ink sm:p-[11px] sm:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]">
      {/* side buttons */}
      <div className="absolute -left-[3px] top-36 hidden h-14 w-[3px] rounded-l bg-ink sm:block" />
      <div className="absolute -left-[3px] top-56 hidden h-14 w-[3px] rounded-l bg-ink sm:block" />
      <div className="absolute -right-[3px] top-44 hidden h-20 w-[3px] rounded-r bg-ink sm:block" />

      <div className="relative flex h-full flex-col overflow-hidden bg-bg sm:rounded-[46px]">
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 hidden h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-black sm:block" />
        <AnimatePresence initial={false}>{!hideStatus && <StatusBar key="status" />}</AnimatePresence>
        {children}
      </div>
    </div>
  )
}
