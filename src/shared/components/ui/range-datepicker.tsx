import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { FormControl } from '@/shared/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { cn } from '@/shared/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'

export type DateDisableStrategy = 'before' | 'after' | 'range' | 'custom' | 'none'

export type DatePickerProps = {
  /** Selected date value */
  value: Date | undefined
  /** Date change handler function */
  onChange: (date: Date | undefined) => void
  /** Format for displaying the date */
  dateFormat?: string
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Strategy for disabling dates */
  disableStrategy?: DateDisableStrategy
  /** Function to determine disabled dates when using 'custom' strategy */
  customDisabledFn?: (date: Date) => boolean
  /** Start date for 'range' disable strategy */
  minDate?: Date
  /** End date for 'range' disable strategy */
  maxDate?: Date
  /** Additional className for styling */
  className?: string
  /** Optional button variant */
  buttonVariant?: 'default' | 'outline' | 'ghost'
  /** Whether the field is disabled */
  disabled?: boolean
  /** Icon to display (defaults to CalendarIcon) */
  icon?: React.ReactNode
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  dateFormat = 'dd.MM.yyyy',
  placeholder = 'Sana tanlang',
  disableStrategy = 'none',
  customDisabledFn,
  minDate,
  maxDate,
  className,
  buttonVariant = 'outline',
  disabled = false,
  icon = <CalendarIcon className="ml-auto size-4 opacity-50" />,
}) => {
  const [isShow, setIsShow] = useState(false)

  // Function to determine which dates should be disabled
  const getDisabledDates = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    switch (disableStrategy) {
      case 'before':
        return date < today
      case 'after':
        return date > today
      case 'range':
        if (minDate && maxDate) {
          return date < minDate || date > maxDate
        }
        return false
      case 'custom':
        return customDisabledFn ? customDisabledFn(date) : false
      case 'none':
      default:
        return false
    }
  }

  return (
    <Popover open={isShow} onOpenChange={(val) => setIsShow(val)}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={buttonVariant}
            disabled={disabled}
            className={cn('w-full pl-3 text-left font-normal', !value && 'text-neutral-350', className)}
          >
            {value ? format(value, dateFormat) : <span>{placeholder}</span>}
            {icon}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(value) => {
            onChange(value)
            setIsShow(false)
          }}
          disabled={getDisabledDates}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
