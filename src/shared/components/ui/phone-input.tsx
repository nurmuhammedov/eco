import { cn } from '@/shared/lib/utils'
import { PhoneIcon } from 'lucide-react'
import React, { forwardRef } from 'react'
import { Input } from '@/shared/components/ui/input'

const UZ_PHONE_PATTERN = /^\+998\d{0,9}$/

type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showIcon?: boolean
  showCountryCode?: boolean
  onValueChange?: (value: string) => void
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, onValueChange, showIcon = false, showCountryCode = true, ...props }, ref) => {
    const formatPhoneNumber = (value: string): string => {
      if (!value) return showCountryCode ? '+998' : ''

      if (showCountryCode && !value.startsWith('+998')) {
        value = '+998' + value.replace(/\D/g, '')
      }

      value = value.replace(/[^\d+]/g, '')

      if (!UZ_PHONE_PATTERN.test(value)) {
        if (value.startsWith('+998')) {
          value = '+998' + value.substring(4).slice(0, 9)
        } else {
          value = value.slice(0, 9)
        }
      }

      return value
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value)

      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: formattedValue },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)

      onValueChange?.(formattedValue)
    }

    return (
      <div className="relative">
        {showIcon && (
          <PhoneIcon
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform"
            aria-hidden="true"
          />
        )}

        <Input
          {...props}
          ref={ref}
          type="tel"
          className={cn(showIcon && 'pl-9', className)}
          onChange={handleInputChange}
          value={formatPhoneNumber((value as string) || '')}
          placeholder={props.placeholder || '+998 XX XXX XX XX'}
        />
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
export { PhoneInput }
