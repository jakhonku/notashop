import * as React from 'react'
import { cn } from '@/lib/utils'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-ink/12 bg-surface px-3 py-2 text-sm text-ink shadow-sm transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export { Select }
