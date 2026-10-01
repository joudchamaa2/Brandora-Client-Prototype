/** Joins class names, skipping falsy values */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export const money = (n: number, digits = 2) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`

export const moneyShort = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k` : `${n}`

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /[a-z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* ---------------------------- localStorage --------------------------- */

const PREFIX = 'brandora:'

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — the demo still works in memory */
  }
}

export function clearStored() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
    sessionStorage.clear()
  } catch {
    /* ignore */
  }
}
