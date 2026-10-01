import { cn } from '../../lib/utils'

const TONES: Record<string, string> = {
  Delivered: 'bg-success/12 text-success ring-success/25',
  Active: 'bg-success/12 text-success ring-success/25',
  'In stock': 'bg-success/12 text-success ring-success/25',
  Paid: 'bg-success/12 text-success ring-success/25',
  Processing: 'bg-info/12 text-info ring-info/25',
  Accepted: 'bg-violet/12 text-violet ring-violet/25',
  'Out for delivery': 'bg-gold/12 text-gold ring-gold/25',
  Scheduled: 'bg-info/12 text-info ring-info/25',
  Invited: 'bg-info/12 text-info ring-info/25',
  Pending: 'bg-warn/12 text-warn ring-warn/25',
  'Pending approval': 'bg-warn/12 text-warn ring-warn/25',
  'Low stock': 'bg-warn/12 text-warn ring-warn/25',
  Draft: 'bg-surface-3 text-muted ring-line-strong',
  Expired: 'bg-surface-3 text-muted ring-line-strong',
  Inactive: 'bg-surface-3 text-muted ring-line-strong',
  Archived: 'bg-surface-3 text-dim ring-line',
  'Out of stock': 'bg-danger/12 text-danger ring-danger/25',
}

export function StatusBadge({ status, className, dot = true }: { status: string; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        TONES[status] ?? 'bg-surface-3 text-muted ring-line',
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {status}
    </span>
  )
}
