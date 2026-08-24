import { useEffect, useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Check, SearchIcon, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useCustomSearchParams, useDebounce } from '@/shared/hooks'
import SearchInput from '@/shared/components/common/search-input/ui/search-input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import DatePicker from '@/shared/components/ui/datepicker'
import { Calendar } from '@/shared/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { cn } from '@/shared/lib/utils'
import { ExtendedColumnDef } from './data-table'

const ICON_STYLE = 'absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none'
const CLEAR_BUTTON_STYLE =
  'absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer flex items-center justify-center bg-white'
const WRAPPER_STYLE = 'relative w-full border-none bg-white transition-colors h-8'
const TRIGGER_CONTENT_STYLE =
  'w-full h-full flex items-center px-0 pl-8 pr-6 text-sm font-normal text-black bg-transparent outline-none cursor-pointer overflow-hidden'

interface ColumnFilterInputProps<TData, TValue> {
  column: ExtendedColumnDef<TData, TValue>
}

const DateRangeFilter = <TData, TValue>({ column }: ColumnFilterInputProps<TData, TValue>) => {
  const { filterRangeKeys = ['startDate', 'endDate'] } = column
  const { paramsObject, addParams, removeParams } = useCustomSearchParams()

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const startDateVal = paramsObject[filterRangeKeys[0]]
    const endDateVal = paramsObject[filterRangeKeys[1]]

    if (!startDateVal) return undefined

    return {
      from: parseISO(String(startDateVal)),
      to: endDateVal ? parseISO(String(endDateVal)) : undefined,
    }
  })

  const formattedValue = useMemo(() => {
    if (!date?.from) return ''
    if (!date.to) return format(date.from, 'dd.MM.yyyy')

    return `${format(date.from, 'dd.MM.yyyy')} - ${format(date.to, 'dd.MM.yyyy')}`
  }, [date])

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range)

    if (!range?.from) {
      removeParams(filterRangeKeys[0], filterRangeKeys[1])
      return
    }

    const params: Record<string, string> = { [filterRangeKeys[0]]: format(range.from, 'yyyy-MM-dd') }

    if (range.to) {
      params[filterRangeKeys[1]] = format(range.to, 'yyyy-MM-dd')
    } else {
      removeParams(filterRangeKeys[1])
    }

    addParams(params, 'page', 'p')
  }

  return (
    <div className={WRAPPER_STYLE}>
      <CalendarIcon className={ICON_STYLE} />
      <Popover>
        <PopoverTrigger asChild>
          <div className={TRIGGER_CONTENT_STYLE} role="button" tabIndex={0}>
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
        <button
          type="button"
          aria-label="Sanani tozalash"
          onClick={(event) => {
            event.stopPropagation()
            setDate(undefined)
            removeParams(filterRangeKeys[0], filterRangeKeys[1])
          }}
          className={CLEAR_BUTTON_STYLE}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

interface ValueFilterProps<TData, TValue> extends ColumnFilterInputProps<TData, TValue> {
  filterKey: string
}

const ValueFilter = <TData, TValue>({ column, filterKey }: ValueFilterProps<TData, TValue>) => {
  const { filterType = 'search', filterOptions, filterDateStrategy = 'none', filterMaxLength = 30 } = column
  const { paramsObject, addParams } = useCustomSearchParams()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(paramsObject[filterKey] || '')
  const debouncedValue = useDebounce(value, 800)

  useEffect(() => {
    if (filterType !== 'search' && filterType !== 'number') return

    // Skip the push when the debounced value already matches the URL.
    if (debouncedValue !== (paramsObject[filterKey] || '')) {
      addParams({ [filterKey]: debouncedValue }, 'page', 'p')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, filterKey, filterType])

  const selectedOptionLabel = useMemo(() => {
    if (!filterOptions || !value) return ''

    const option = filterOptions.find((opt) => opt.id.toString() === value.toString())
    const label = option ? option.name : value

    return label.length > 70 ? `${label.slice(0, 70)}...` : label
  }, [filterOptions, value])

  const handleImmediateChange = (val: any) => {
    setValue(val)
    addParams({ [filterKey]: val }, 'page', 'p')
  }

  if (filterType === 'select') {
    return (
      <div className={WRAPPER_STYLE}>
        <SearchIcon className={ICON_STYLE} />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className={TRIGGER_CONTENT_STYLE} role="button" tabIndex={0}>
              <span className={cn('truncate', !value && 'text-neutral-400')}>{value ? selectedOptionLabel : ''}</span>
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[400px] p-0" align="start">
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
          <button
            type="button"
            aria-label="Filtrni tozalash"
            onClick={(event) => {
              event.stopPropagation()
              handleImmediateChange(null)
            }}
            className={CLEAR_BUTTON_STYLE}
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  if (filterType === 'date') {
    return (
      <div className={cn(WRAPPER_STYLE, 'group')}>
        <SearchIcon className={ICON_STYLE} />
        <div className="absolute inset-0 [&>button]:h-full [&>button]:w-full [&>button]:justify-start [&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:pl-8 [&>button]:text-xs [&>button]:font-normal [&>button]:text-black [&>button]:shadow-none [&>button]:hover:bg-transparent">
          <DatePicker
            value={value ? new Date(value) : undefined}
            filter={true}
            onChange={(date) => handleImmediateChange(date ? format(date, 'yyyy-MM-dd') : null)}
            placeholder=""
            disableStrategy={filterDateStrategy}
            icon={null}
          />
        </div>
        {value && (
          <button type="button" onClick={() => handleImmediateChange(null)} className={CLEAR_BUTTON_STYLE}>
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
          if (val === '' || /^[0-9\b]+$/.test(val)) setValue(val)
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
      onChange={setValue}
      className="h-8 w-full bg-white text-xs font-normal"
      variant="underline"
    />
  )
}

export const ColumnFilterInput = <TData, TValue>({ column }: ColumnFilterInputProps<TData, TValue>) => {
  if (column.filterType === 'date-range') return <DateRangeFilter column={column} />

  if (!column.filterKey) return null

  return <ValueFilter column={column} filterKey={column.filterKey} />
}
