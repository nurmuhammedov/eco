import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
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

interface OptionType {
  id: string | number
  name: string
}

interface ComboboxProps {
  options: OptionType[]
  value?: string | number | null
  onChange: (value: string | number) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Tanlang...',
  searchPlaceholder = 'Qidirish...',
  emptyText = 'Maʼlumot topilmadi!',
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded border border-neutral-300 bg-white px-3 py-1 text-base shadow-xs transition-colors',
            'md:text-sm',
            'focus-visible:ring-teal focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            !selectedOption && 'text-neutral-350',
            className
          )}
        >
          <span className="mr-2 flex-1 truncate text-left text-neutral-900">
            {selectedOption ? selectedOption.name : <span className="text-neutral-350">{placeholder}</span>}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    onChange(option.id)
                    setOpen(false)
                  }}
                >
                  <span
                    className={cn(
                      'absolute top-2 left-2 flex h-3.5 w-3.5 items-center justify-center',
                      value === option.id ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
