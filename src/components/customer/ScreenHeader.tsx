import { motion } from 'framer-motion'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { forwardRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useCustomer } from '../../context/CustomerContext'
import { cn } from '../../lib/utils'
import { IconButton } from '../shared/Button'

interface Props {
  title?: string
  back?: string | true
  right?: ReactNode
  className?: string
}

/** Standard top row for inner customer screens: back button + title + actions */
export function ScreenHeader({ title, back, right, className }: Props) {
  const navigate = useNavigate()
  return (
    <div className={cn('flex h-14 shrink-0 items-center gap-3 px-5', className)}>
      {back && (
        <IconButton label="Back" onClick={() => (back === true ? navigate(-1) : navigate(back))}>
          <ChevronLeft className="size-5" />
        </IconButton>
      )}
      {title && <h1 className="flex-1 truncate text-lg font-semibold text-fg">{title}</h1>}
      {!title && <div className="flex-1" />}
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}

/** Cart button with live item count — also the target of the add-to-cart animation */
export const CartButton = forwardRef<HTMLButtonElement, { className?: string }>(function CartButton({ className }, ref) {
  const navigate = useNavigate()
  const { cartCount } = useCustomer()
  return (
    <IconButton ref={ref} label="Cart" onClick={() => navigate('/customer/cart')} className={cn('relative', className)}>
      <ShoppingBag className="size-[18px]" />
      {cartCount > 0 && (
        <motion.span
          key={cartCount}
          initial={{ scale: 0.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 15 }}
          className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-ink"
        >
          {cartCount}
        </motion.span>
      )}
    </IconButton>
  )
})
