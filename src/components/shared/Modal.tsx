import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

/** Centered dialog used in the business dashboard */
export function Modal({ open, onClose, title, description, children, footer, width = 'max-w-lg' }: Props) {
  useEscape(open, onClose)
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-ink/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={cn(
              'card-surface relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl',
              width,
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-fg">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg">
                <X className="size-4" />
              </button>
            </div>
            <div className="thin-scrollbar overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex justify-end gap-3 border-t border-line bg-bg-2/60 px-6 py-4">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/** Right-hand side panel (order details, notifications…) */
export function Drawer({ open, onClose, title, description, children, footer }: Omit<Props, 'width'>) {
  useEscape(open, onClose)
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-bg-2 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-fg">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg">
                <X className="size-4" />
              </button>
            </div>
            <div className="thin-scrollbar flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex gap-3 border-t border-line px-6 py-4">{footer}</div>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
