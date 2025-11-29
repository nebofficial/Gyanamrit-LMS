import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-black placeholder:text-amber-900/70 selection:bg-primary selection:text-primary-foreground border-amber-900/40 h-9 w-full min-w-0 rounded-md border bg-amber-50/95 px-3 py-1 text-base text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-x-auto whitespace-nowrap dark:bg-amber-950/40 dark:text-black',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
