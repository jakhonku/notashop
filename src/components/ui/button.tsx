import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-ink text-surface-base hover:bg-ink/90 shadow-[0_2px_12px_rgba(26,22,18,0.18)]',
        accent:
          'bg-accent text-white hover:bg-accent-hover shadow-[0_2px_12px_rgba(31,58,95,0.25)]',
        gold:
          'bg-gold text-ink hover:bg-gold/90 shadow-[0_2px_12px_rgba(184,135,70,0.25)]',
        secondary:
          'bg-surface text-ink hover:bg-surface-alt ring-1 ring-ink/10',
        outline:
          'border border-ink/15 bg-surface text-ink hover:bg-surface-alt',
        ghost: 'text-ink hover:bg-ink/5',
        link: 'text-accent underline-offset-4 hover:underline',
        destructive:
          'bg-rose-700 text-white hover:bg-rose-800 shadow-[0_2px_10px_rgba(225,29,72,0.25)]',
      },
      size: {
        default: 'h-11 px-6 text-sm rounded-full',
        sm: 'h-9 px-4 text-sm rounded-full',
        lg: 'h-12 px-7 text-base rounded-full',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
