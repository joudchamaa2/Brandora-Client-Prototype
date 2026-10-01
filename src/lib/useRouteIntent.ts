import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * Reads a one-off "intent" passed through router state (e.g. `{ add: true }` to open
 * a modal) and clears it from history so a reload doesn't replay it.
 * Returns a new object each time a fresh intent arrives, so it can drive effects.
 */
export function useRouteIntent<T extends object>(): Partial<T> {
  const location = useLocation()
  const navigate = useNavigate()
  const [intent, setIntent] = useState<Partial<T>>(() => (location.state ?? {}) as Partial<T>)

  useEffect(() => {
    if (!location.state) return
    setIntent(location.state as Partial<T>)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  return intent
}
