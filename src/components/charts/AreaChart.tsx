import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState } from 'react'
import { niceMax, smoothPath, useMeasure } from './useMeasure'

export interface ChartDatum {
  label: string
  value: number
}

interface Props {
  data: ChartDatum[]
  height?: number
  color?: string
  format?: (v: number) => string
  /** Changing this replays the draw-in animation (e.g. the selected range) */
  animationKey?: string
  /** Hide the filled area and draw only the line */
  lineOnly?: boolean
}

const PAD = { top: 14, right: 12, bottom: 28, left: 46 }

export function AreaChart({ data, height = 260, color = '#E8B948', format = (v) => `${v}`, animationKey, lineOnly }: Props) {
  const [ref, width] = useMeasure<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const gid = useId().replace(/:/g, '')

  const w = Math.max(0, width - PAD.left - PAD.right)
  const h = height - PAD.top - PAD.bottom
  const max = niceMax(Math.max(...data.map((d) => d.value)) * 1.08)
  const pts = data.map((d, i) => ({
    x: PAD.left + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w),
    y: PAD.top + h - (d.value / max) * h,
  }))
  const line = smoothPath(pts)
  const area = pts.length ? `${line} L${pts[pts.length - 1].x},${PAD.top + h} L${pts[0].x},${PAD.top + h} Z` : ''
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(w / 70)))

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - PAD.left
    const i = Math.round((x / w) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} onMouseMove={onMove} onMouseLeave={() => setHover(null)} className="overflow-visible">
          <defs>
            <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.32" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => {
            const y = PAD.top + h - t * h
            return (
              <g key={t}>
                <line x1={PAD.left} x2={PAD.left + w} y1={y} y2={y} stroke="#1f2a48" strokeDasharray={t === 0 ? undefined : '3 5'} />
                <text x={PAD.left - 10} y={y} textAnchor="end" dominantBaseline="middle" className="fill-dim text-[11px]">
                  {format(max * t)}
                </text>
              </g>
            )
          })}

          {data.map((d, i) =>
            i % labelEvery === 0 || i === data.length - 1 ? (
              <text key={i} x={pts[i].x} y={height - 8} textAnchor="middle" className="fill-dim text-[11px]">
                {d.label}
              </text>
            ) : null,
          )}

          <g key={animationKey}>
            {!lineOnly && (
              <motion.path
                d={area}
                fill={`url(#area-${gid})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            )}
            <motion.path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>

          {hover !== null && pts[hover] && (
            <g>
              <line x1={pts[hover].x} x2={pts[hover].x} y1={PAD.top} y2={PAD.top + h} stroke={color} strokeOpacity={0.35} />
              <circle cx={pts[hover].x} cy={pts[hover].y} r={9} fill={color} fillOpacity={0.18} />
              <circle cx={pts[hover].x} cy={pts[hover].y} r={4.5} fill="#080C18" stroke={color} strokeWidth={2.5} />
            </g>
          )}
        </svg>
      )}

      <AnimatePresence>
        {hover !== null && pts[hover] && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-line-strong bg-surface-2/95 px-3 py-2 text-center shadow-xl backdrop-blur"
            style={{ left: Math.min(Math.max(pts[hover].x, 60), width - 60), top: pts[hover].y - 12 }}
          >
            <div className="text-[11px] text-muted">{data[hover].label}</div>
            <div className="text-sm font-bold text-fg">{format(data[hover].value)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
