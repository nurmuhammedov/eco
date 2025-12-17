import { useCustomSearchParams } from '@/shared/hooks'
import SearchInput from '@/shared/components/common/search-input/ui/search-input'
import { useEffect, useMemo, useState } from 'react'
import { ExtendedColumnDef } from './data-table'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import DatePicker from '@/shared/components/ui/datepicker'
import { Calendar as CalendarIcon, Check, SearchIcon, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn } from '@/shared/lib/utils'
import { Calendar } from '@/shared/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'

function useDebounce(value: any, delay = 800) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface ColumnFilterInputProps<TData, TValue> {
  column: ExtendedColumnDef<TData, TValue>
}

export const ColumnFilterInput = <TData, TValue>({ column }: ColumnFilterInputProps<TData, TValue>) => {
  const {
    filterKey,
    filterType = 'search',
    filterOptions,
    filterDateStrategy = 'none',
    filterMaxLength = 30,
    filterRangeKeys = ['startDate', 'endDate'],
  } = column

  const { paramsObject, addParams, removeParams } = useCustomSearchParams()

  const [open, setOpen] = useState(false)

  const iconStyle = 'absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none z-10'
  const clearButtonStyle =
    'absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer z-10 flex items-center justify-center bg-white'
  const wrapperStyle = 'relative w-full border-none bg-white transition-colors h-8'
  const triggerContentStyle =
    'w-full h-full flex items-center px-0 pl-8 pr-6 text-sm font-normal text-black bg-transparent outline-none cursor-pointer overflow-hidden'

  if (filterType === 'date-range') {
    const startDateVal = paramsObject[filterRangeKeys[0]]
    const endDateVal = paramsObject[filterRangeKeys[1]]

    const [date, setDate] = useState<DateRange | undefined>(() => {
      if (startDateVal) {
        return {
          from: parseISO(String(startDateVal)),
          to: endDateVal ? parseISO(String(endDateVal)) : undefined,
        }
      }
      return undefined
    })

    const handleDateSelect = (range: DateRange | undefined) => {
      setDate(range)
      if (range?.from) {
        const params: any = {
          [filterRangeKeys[0]]: format(range.from, 'yyyy-MM-dd'),
        }
        if (range.to) {
          params[filterRangeKeys[1]] = format(range.to, 'yyyy-MM-dd')
        } else {
          removeParams(filterRangeKeys[1])
        }
        addParams(params, 'page', 'p')
      } else {
        removeParams(filterRangeKeys[0], filterRangeKeys[1])
      }
    }

    const formattedValue = useMemo(() => {
      if (!date?.from) return ''
      if (!date.to) return format(date.from, 'dd.MM.yyyy')
      return `${format(date.from, 'dd.MM.yyyy')} - ${format(date.to, 'dd.MM.yyyy')}`
    }, [date])

    return (
      <div className={wrapperStyle}>
        <CalendarIcon className={iconStyle} />
        <Popover>
          <PopoverTrigger asChild>
            <div className={triggerContentStyle} role="button" tabIndex={0}>
              <span className={cn('truncate text-xs', !date && 'text-neutral-400')}>{formattedValue}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {date && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              setDate(undefined)
              removeParams(filterRangeKeys[0], filterRangeKeys[1])
            }}
            className={clearButtonStyle}
          >
            <X size={14} />
          </div>
        )}
      </div>
    )
  }

  if (!filterKey) return null

  const initialValue = paramsObject[filterKey] || ''
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 800)

  useEffect(() => {
    if ((filterType === 'search' || filterType === 'number') && value !== null) {
      addParams({ [filterKey]: debouncedValue }, 'page', 'p')
    }
  }, [debouncedValue, filterKey, filterType])

  const handleImmediateChange = (val: any) => {
    setValue(val)
    addParams({ [filterKey]: val }, 'page', 'p')
  }

  const selectedOptionLabel = useMemo(() => {
    if (!filterOptions || !value) return ''
    const option = filterOptions.find((opt) => opt.id.toString() === value.toString())
    return option ? option?.name : value
  }, [filterOptions, value])

  if (filterType === 'select') {
    return (
      <div className={wrapperStyle}>
        <SearchIcon className={iconStyle} />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className={triggerContentStyle} role="button" tabIndex={0}>
              <span className={cn('truncate', !value && 'text-neutral-400')}>{value ? selectedOptionLabel : ''}</span>
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput hideIcon placeholder="Qidirish..." className="h-9 pl-2" />
              <CommandList>
                <CommandEmpty>Topilmadi!</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.map((option) => (
                    <CommandItem
                      className="pl-1"
                      key={option.id}
                      value={option.name}
                      onSelect={() => {
                        handleImmediateChange(option.id.toString())
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value?.toString() === option.id?.toString() ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {value && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleImmediateChange(null)
            }}
            className={clearButtonStyle}
          >
            <X size={14} />
          </div>
        )}
      </div>
    )
  }

  if (filterType === 'date') {
    const dateValue = value ? new Date(value) : undefined

    return (
      <div className={cn(wrapperStyle, 'group')}>
        <SearchIcon className={iconStyle} />
        <div className="absolute inset-0 [&>button]:h-full [&>button]:w-full [&>button]:justify-start [&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:pl-8 [&>button]:text-xs [&>button]:font-normal [&>button]:text-black [&>button]:shadow-none [&>button]:hover:bg-transparent">
          <DatePicker
            value={dateValue}
            filter={true}
            onChange={(date) => {
              const formatted = date ? format(date, 'yyyy-MM-dd') : null
              handleImmediateChange(formatted)
            }}
            placeholder=""
            disableStrategy={filterDateStrategy}
            icon={null}
          />
        </div>
        {value && (
          <button type="button" onClick={() => handleImmediateChange(null)} className={clearButtonStyle}>
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  if (filterType === 'number') {
    return (
      <SearchInput
        value={value}
        placeholder=""
        maxLength={filterMaxLength}
        onChange={(val) => {
          const re = /^[0-9\b]+$/
          if (val === '' || re.test(val)) {
            setValue(val)
          }
        }}
        className="h-8 w-full bg-white text-xs font-normal"
        variant="underline"
      />
    )
  }

  return (
    <SearchInput
      value={value}
      placeholder=""
      onChange={(val) => setValue(val)}
      className="h-8 w-full bg-white text-xs font-normal"
      variant="underline"
    />
  )
}
