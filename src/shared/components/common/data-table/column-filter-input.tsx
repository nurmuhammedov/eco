import { useCustomSearchParams } from '@/shared/hooks'
import SearchInput from '@/shared/components/common/search-input/ui/search-input'
import { useEffect, useState, useMemo } from 'react'
import { ExtendedColumnDef } from './data-table'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import DatePicker from '@/shared/components/ui/datepicker'
import { SearchIcon, X, Check } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/shared/lib/utils'

function useDebounce(value: any, delay = 500) {
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
  const { filterKey, filterType = 'search', filterOptions, filterDateStrategy = 'none', filterMaxLength = 30 } = column
  const { paramsObject, addParams } = useCustomSearchParams()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  if (!filterKey) return null

  const initialValue = paramsObject[filterKey] || ''
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    if ((filterType === 'search' || filterType === 'number') && value !== null) {
      addParams({ [filterKey]: debouncedValue }, 'page', 'p')
    }
  }, [debouncedValue, filterKey, filterType])

  const handleImmediateChange = (val: any) => {
    setValue(val)
    addParams({ [filterKey]: val }, 'page', 'p')
  }

  const iconStyle = 'absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none z-10'

  const clearButtonStyle =
    'absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer z-10 flex items-center justify-center bg-white'

  const wrapperStyle = 'relative w-full border-none bg-white transition-colors h-8'

  const triggerContentStyle =
    'w-full h-full flex items-center px-0 pl-8 pr-6 text-sm font-normal text-black bg-transparent outline-none cursor-pointer overflow-hidden'

  const selectedOptionLabel = useMemo(() => {
    if (!filterOptions || !value) return ''
    const option = filterOptions.find((opt) => opt.id.toString() === value.toString())
    return option ? option?.name : value
  }, [filterOptions, value])

  const filteredOptions = useMemo(() => {
    if (!filterOptions) return []
    if (!searchQuery) return filterOptions
    return filterOptions.filter((opt) => opt?.name?.toString().toLowerCase().includes(searchQuery?.toLowerCase()))
  }, [filterOptions, searchQuery])

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

          <PopoverContent className="max-w-[150px] p-0" align="start">
            <div className="flex max-h-[250px] flex-col">
              <div className="flex items-center border-b px-3 pt-3 pb-2">
                <SearchIcon className="mr-2 h-4 w-4 opacity-50" />
                <input
                  className="placeholder:text-muted-foreground flex h-4 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto p-1">
                {filteredOptions.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">Topilmadi!</div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        'hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        value?.toString() === option.id?.toString() && 'bg-neutral-100'
                      )}
                      onClick={() => {
                        handleImmediateChange(option.id?.toString())
                        setOpen(false)
                        setSearchQuery('')
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value?.toString() === option.id?.toString() ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.name}
                    </div>
                  ))
                )}
              </div>
            </div>
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
