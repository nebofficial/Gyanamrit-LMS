import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-amber-900/40 placeholder:text-amber-900/70 focus-visible:border-amber-800 focus-visible:ring-amber-800/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-24 w-full rounded-md border bg-amber-50/95 px-3 py-2 text-base text-black shadow-[0_6px_20px_rgba(120,53,15,0.25)] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-auto resize-y dark:bg-amber-950/40 dark:text-black',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
