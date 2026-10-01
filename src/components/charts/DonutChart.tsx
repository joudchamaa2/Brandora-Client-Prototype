import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '../../lib/utils'

interface Slice {
  label: string
  value: number
  color: string
}

/** Donut with animated segments and an interactive legend */
export function DonutChart({ data, size = 190, centerLabel = 'Total sales' }: { data: Slice[]; size?: number; centerLabel?: string }) {
  const [active, setActive] = useState<number | null>(null)
  const total = data.reduce((s, d) => s + d.value, 0)
  const gap = 1.2
  let offset = 0

  const shown = active !== null ? data[active] : null

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 42 42" className="size-full -rotate-90">
          <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#16213e" strokeWidth="5" />
          {data.map((d, i) => {
            const pct = (d.value / total) * 100
            const dash = Math.max(0, pct - gap)
            const el = (
              <motion.circle
                key={d.label}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                stroke={d.color}
                strokeWidth={active === i ? 6.2 : 5}
                strokeLinecap="round"
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${dash} ${100 - dash}`, opacity: active === null || active === i ? 1 : 0.35 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer"
              />
            )
            offset += pct
            return el
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-2xl font-bold text-fg">{shown ? `${shown.value}%` : '100%'}</div>
            <div className="text-[11px] text-muted">{shown ? shown.label : centerLabel}</div>
          </div>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((d, i) => (
          <li
            key={d.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={cn('flex cursor-default items-center gap-3 rounded-lg px-2 py-1 text-sm transition-colors', active === i && 'bg-surface-2')}
          >
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 text-muted">{d.label}</span>
            <span className="font-semibold text-fg">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
