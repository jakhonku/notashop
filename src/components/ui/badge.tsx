import * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        className,
      )}
      {...props}
    />
  ),
)
Badge.displayName = 'Badge'

export { Badge }
