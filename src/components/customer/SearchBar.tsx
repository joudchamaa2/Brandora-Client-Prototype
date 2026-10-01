import { Search, X } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
  onFocus?: () => void
  placeholder?: string
  autoFocus?: boolean
  readOnly?: boolean
  className?: string
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { value, onChange, onSubmit, onFocus, placeholder = 'Search stores or products', autoFocus, readOnly, className },
  ref,
) {
  return (
    <label
      className={cn(
        'flex h-12 items-center gap-3 rounded-2xl border border-line bg-surface px-4 transition-colors focus-within:border-gold/60',
        className,
      )}
    >
      <Search className="size-[18px] shrink-0 text-muted" />
      <input
        ref={ref}
        value={value}
        readOnly={readOnly}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-muted"
        aria-label={placeholder}
      />
      {value && !readOnly && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="text-dim hover:text-fg">
          <X className="size-4" />
        </button>
      )}
    </label>
  )
})

export function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-9 shrink-0 rounded-full border px-4 text-[12.5px] font-semibold transition-all',
        active ? 'border-gold bg-gold/12 text-gold' : 'border-line text-muted hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
