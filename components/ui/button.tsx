import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-amber-500/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Positive / primary actions: deep red base, green on hover
        default:
          'bg-[#681112] text-amber-100 hover:bg-emerald-600 hover:text-emerald-50 shadow-[0_4px_18px_rgba(88,17,18,0.4)]',
        // Danger / cancel / delete: same base, red on hover
        destructive:
          'bg-[#681112] text-amber-100 hover:bg-red-700 hover:text-red-50 focus-visible:ring-red-500/40',
        // Subtle buttons with border only
        outline:
          'border border-amber-900/60 bg-transparent text-amber-100 shadow-xs hover:bg-amber-50/10 hover:text-amber-50',
        secondary:
          'bg-amber-800 text-amber-50 hover:bg-amber-700 hover:text-white shadow-[0_3px_14px_rgba(120,53,15,0.45)]',
        ghost:
          'text-amber-50 hover:bg-amber-50/10 hover:text-amber-50',
        link: 'text-amber-200 underline-offset-4 hover:text-emerald-300 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
