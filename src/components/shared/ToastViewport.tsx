import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../lib/utils'

const ICONS = {
  success: <CheckCircle2 className="size-5 text-success" />,
  info: <Info className="size-5 text-info" />,
  error: <AlertCircle className="size-5 text-danger" />,
}

/**
 * Renders the active toasts. The customer app places it inside the phone frame
 * (absolute, top) and the dashboard fixes it to the bottom-right corner.
 */
export function ToastViewport({ placement }: { placement: 'phone' | 'desktop' }) {
  const { toasts, dismiss } = useToast()
  const phone = placement === 'phone'

  return (
    <div
      className={cn(
        'pointer-events-none z-[90] flex flex-col gap-2',
        phone ? 'absolute inset-x-3 top-12' : 'fixed bottom-5 right-5 w-[360px] max-w-[calc(100vw-2.5rem)]',
      )}
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: phone ? -16 : 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: phone ? -10 : 10, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line-strong bg-surface-2/95 p-3.5 shadow-2xl backdrop-blur-md"
          >
            <div className="mt-0.5">{ICONS[t.tone]}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-fg">{t.title}</div>
              {t.description && <div className="mt-0.5 text-xs leading-relaxed text-muted">{t.description}</div>}
            </div>
            {t.action && (
              <button
                onClick={() => {
                  t.action!.onClick()
                  dismiss(t.id)
                }}
                className="shrink-0 self-center rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
              >
                {t.action.label}
              </button>
            )}
            {!t.action && (
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-dim hover:text-fg">
                <X className="size-4" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
