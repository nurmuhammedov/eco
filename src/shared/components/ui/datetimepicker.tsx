import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { cn } from '@/shared/lib/utils'
import { format, isValid, setHours, setMinutes, setSeconds } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface DateTimePickerProps {
  value?: Date | null
  onChange: (date?: Date) => void
  placeholder?: string
}

const generateRange = (size: number) => {
  return Array.from({ length: size }, (_, i) => String(i).padStart(2, '0'))
}
const hours = generateRange(24)
const minutes = generateRange(60)

const DateTimePicker = ({ value, onChange, placeholder }: DateTimePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(value || undefined)
  const [hour, setHour] = useState(() => (value && isValid(value) ? format(value, 'HH') : '09'))
  const [minute, setMinute] = useState(() => (value && isValid(value) ? format(value, 'mm') : '00'))

  useEffect(() => {
    if (value && isValid(value)) {
      setDate(value)
      setHour(format(value, 'HH'))
      setMinute(format(value, 'mm'))
    } else {
      setDate(undefined)
    }
  }, [value])

  const updateFullDate = (newDatePart: Date, newHour: string, newMinute: string) => {
    let newDate = setHours(newDatePart, Number(newHour))
    newDate = setMinutes(newDate, Number(newMinute))
    newDate = setSeconds(newDate, 0) // Sekundlarni nolga tenglashtiramiz
    setDate(newDate)
    onChange(newDate)
  }

  const handleDateChange = (selectedDate?: Date) => {
    if (!selectedDate) {
      setDate(undefined)
      onChange(undefined)
      return
    }
    updateFullDate(selectedDate, hour, minute)
  }

  const handleHourChange = (newHour: string) => {
    setHour(newHour)
    if (date) {
      updateFullDate(date, newHour, minute)
    }
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute)
    if (date) {
      updateFullDate(date, hour, newMinute)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && isValid(date) ? (
            format(date, 'dd.MM.yyyy, HH:mm')
          ) : (
            <span>{placeholder || 'Sana va vaqtni tanlang'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
        <div className="border-border flex items-center justify-center gap-2 border-t p-3">
          <Select value={hour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {hours.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="font-bold">:</span>
          <Select value={minute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {minutes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker
