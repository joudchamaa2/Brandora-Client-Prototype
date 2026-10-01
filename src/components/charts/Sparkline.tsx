import { motion } from 'framer-motion'
import { useId } from 'react'
import { smoothPath } from './useMeasure'

export function Sparkline({ values, color = '#E8B948', width = 96, height = 32 }: { values: number[]; color?: string; width?: number; height?: number }) {
  const gid = useId().replace(/:/g, '')
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - 3 - ((v - min) / (max - min || 1)) * (height - 6),
  }))
  const d = smoothPath(pts)
  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`sp-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} L${width},${height} L0,${height} Z`}
        fill={`url(#sp-${gid})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
