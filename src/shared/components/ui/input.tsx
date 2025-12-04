import * as React from 'react'
import { cn } from '@/shared/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const originalValue = e.target.value
      const cleanValue = originalValue.replace(/[\u0400-\u04FF]/g, '')
      if (originalValue !== cleanValue) {
        e.target.value = cleanValue
      }
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <input
        type={type}
        onChange={handleChange}
        className={cn(
          'file:text-foreground placeholder:text-neutral-350 focus-visible:ring-teal flex h-9 w-full rounded border border-neutral-300 bg-white px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
