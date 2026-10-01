import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}

/** Counts from the previous value to the new value (used for totals and KPIs) */
export function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString('en-US'), duration = 0.9, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(from.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    })
    from.current = value
    return () => controls.stop()
  }, [value, inView, duration])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {format(display)}
    </span>
  )
}
