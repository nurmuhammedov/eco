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
  value: Date | undefined
  filter?: boolean
  onChange: (date: Date | undefined) => void
  dateFormat?: string
  placeholder?: string
  disableStrategy?: DateDisableStrategy
  customDisabledFn?: (date: Date) => boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  buttonVariant?: 'default' | 'outline' | 'ghost'
  disabled?: boolean
  icon?: React.ReactNode
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  dateFormat = 'dd.MM.yyyy',
  placeholder = 'Sanani tanlang',
  disableStrategy = 'none',
  customDisabledFn,
  minDate,
  maxDate,
  className,
  filter = false,
  buttonVariant = 'outline',
  disabled = false,
  icon = <CalendarIcon className="ml-auto size-4 opacity-50" />,
}) => {
  const [isShow, setIsShow] = useState(false)

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
    <Popover modal={true} open={isShow} onOpenChange={(val) => setIsShow(val)}>
      <PopoverTrigger asChild>
        {filter ? (
          <div
            className={
              'flex h-full w-full cursor-pointer items-center overflow-hidden bg-transparent px-0 pr-6 pl-8 text-sm font-normal text-black outline-none'
            }
            role="button"
            tabIndex={0}
          >
            <span className={cn('truncate', !value && 'text-neutral-400')}>
              {value ? format(value, dateFormat) : null}
            </span>
          </div>
        ) : (
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
        )}
      </PopoverTrigger>
      <PopoverContent className="z-[60] w-auto p-0" align="start">
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
