import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface ToastItem {
  id: number
  title: string
  description?: string
  tone: 'success' | 'info' | 'error'
  action?: { label: string; onClick: () => void }
}

interface ToastApi {
  toasts: ToastItem[]
  toast: (t: Omit<ToastItem, 'id' | 'tone'> & { tone?: ToastItem['tone'] }) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), [])

  const toast = useCallback<ToastApi['toast']>(
    (t) => {
      const id = nextId++
      setToasts((ts) => [...ts.slice(-2), { tone: 'success', ...t, id }])
      setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss])
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
