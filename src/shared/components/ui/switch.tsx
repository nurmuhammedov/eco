import * as React from 'react'
import { cn } from '@/shared/lib/utils'

const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="peer sr-only" ref={ref} {...props} />
      <div
        className={cn(
          "peer h-6 w-11 rounded-full bg-neutral-200 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-neutral-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white",
          className
        )}
      ></div>
    </label>
  )
)
Switch.displayName = 'Switch'

export { Switch }
