import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { forwardRef, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary: 'gold-gradient text-gold-ink shadow-glow hover:brightness-105 disabled:bg-none disabled:bg-surface-3 disabled:text-dim disabled:shadow-none',
  secondary: 'bg-surface-2 text-fg border border-line hover:border-line-strong hover:bg-surface-3',
  outline: 'border border-gold/50 text-gold hover:bg-gold/10',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] rounded-xl gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-14 px-6 text-[15px] rounded-2xl gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  block,
  icon,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex select-none items-center justify-center font-semibold tracking-[0.01em] transition-[background,color,border-color,box-shadow,filter] duration-200',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </motion.button>
  )
}

/** Small round icon button (back, share, close…) */
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLMotionProps<'button'>, 'children'> & { label: string; children: ReactNode }
>(function IconButton({ className, children, label, ...rest }, ref) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-fg transition-colors hover:border-line-strong hover:bg-surface-2',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
})
