import { useEffect, useState } from 'react'
import { readStored, writeStored } from './utils'

/** useState that mirrors its value into localStorage (namespaced with "brandora:") */
export function usePersistentState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() =>
    readStored<T>(key, typeof initial === 'function' ? (initial as () => T)() : initial),
  )

  useEffect(() => {
    writeStored(key, value)
  }, [key, value])

  return [value, setValue] as const
}

/** Re-renders every `ms` milliseconds and returns the current timestamp */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}
