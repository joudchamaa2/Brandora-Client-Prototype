import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { ChartDatum } from './AreaChart'
import { niceMax, useMeasure } from './useMeasure'

interface Props {
  data: ChartDatum[]
  height?: number
  color?: string
  format?: (v: number) => string
  animationKey?: string
}

const PAD = { top: 12, right: 8, bottom: 28, left: 38 }

export function BarChart({ data, height = 240, color = '#60A5FA', format = (v) => `${v}`, animationKey }: Props) {
  const [ref, width] = useMeasure<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const w = Math.max(0, width - PAD.left - PAD.right)
  const h = height - PAD.top - PAD.bottom
  const max = niceMax(Math.max(...data.map((d) => d.value)) * 1.1)
  const slot = data.length ? w / data.length : 0
  const barW = Math.max(3, Math.min(34, slot * 0.62))
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(w / 56)))

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} onMouseLeave={() => setHover(null)}>
          {[0, 0.5, 1].map((t) => {
            const y = PAD.top + h - t * h
            return (
              <g key={t}>
                <line x1={PAD.left} x2={PAD.left + w} y1={y} y2={y} stroke="#1f2a48" strokeDasharray={t === 0 ? undefined : '3 5'} />
                <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-dim text-[11px]">
                  {format(max * t)}
                </text>
              </g>
            )
          })}
          <g key={animationKey}>
            {data.map((d, i) => {
              const bh = (d.value / max) * h
              const x = PAD.left + i * slot + (slot - barW) / 2
              return (
                <g key={i} onMouseEnter={() => setHover(i)}>
                  <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={h} fill="transparent" />
                  <motion.rect
                    x={x}
                    y={PAD.top + h - bh}
                    width={barW}
                    height={bh}
                    rx={Math.min(6, barW / 2)}
                    fill={color}
                    fillOpacity={hover === null || hover === i ? 0.95 : 0.35}
                    style={{ transformOrigin: 'bottom', transformBox: 'fill-box' }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6, delay: i * (0.4 / data.length), ease: [0.22, 1, 0.36, 1] }}
                  />
                </g>
              )
            })}
          </g>
          {data.map((d, i) =>
            i % labelEvery === 0 ? (
              <text key={i} x={PAD.left + i * slot + slot / 2} y={height - 8} textAnchor="middle" className="fill-dim text-[11px]">
                {d.label}
              </text>
            ) : null,
          )}
        </svg>
      )}
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-line-strong bg-surface-2/95 px-3 py-2 text-center shadow-xl"
            style={{
              left: Math.min(Math.max(PAD.left + hover * slot + slot / 2, 50), width - 50),
              top: PAD.top + h - (data[hover].value / max) * h - 8,
            }}
          >
            <div className="text-[11px] text-muted">{data[hover].label}</div>
            <div className="text-sm font-bold text-fg">{format(data[hover].value)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
