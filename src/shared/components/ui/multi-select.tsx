import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'

export type MultiSelectOption = {
  id: string | number
  name: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  className?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  maxDisplayItems?: number
  disabled?: boolean
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      className,
      placeholder = 'Tanlang...',
      searchPlaceholder = 'Qidirish...',
      emptyText = "Ma'lumot topilmadi",
      maxDisplayItems = 3,
      disabled,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (optionId: string | number) => {
      if (!onChange) return
      const newValue = value.includes(optionId) ? value.filter((id) => id !== optionId) : [...value, optionId]
      onChange(newValue)
    }

    const handleRemove = (e: React.MouseEvent, optionId: string | number) => {
      e.stopPropagation()
      if (!onChange) return
      onChange(value.filter((id) => id !== optionId))
    }

    const selectedOptions = options.filter((option) => value.includes(option.id))

    return (
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            className={cn(
              'flex h-auto min-h-9 w-full items-center justify-between rounded border border-neutral-300 bg-white px-3 py-1 text-base shadow-xs transition-colors',
              'md:text-sm',
              'focus-visible:ring-teal focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          >
            <div className="mr-2 flex flex-1 flex-wrap items-center gap-1.5 text-left">
              {selectedOptions.length > 0 ? (
                <>
                  {selectedOptions.slice(0, maxDisplayItems).map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-1 rounded-sm border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-900"
                    >
                      {option.name}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleRemove(e, option.id)}
                        className="ml-0.5 cursor-pointer rounded-sm text-neutral-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </div>
                    </div>
                  ))}

                  {selectedOptions.length > maxDisplayItems && (
                    <span className="rounded-sm border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                      +{selectedOptions.length - maxDisplayItems} ta
                    </span>
                  )}
                </>
              ) : (
                <span className="text-neutral-350">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="z-[60] w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.id)
                  return (
                    <CommandItem key={option.id} value={option.name} onSelect={() => handleSelect(option.id)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-neutral-300',
                          isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className={cn('h-3 w-3')} />
                      </div>
                      {option.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
