import * as React from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'
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

interface SelectOrInputProps {
  options: readonly string[]
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
}

/**
 * A list of the usual answers that still takes one it has never heard of. The
 * field is plain text on the wire either way, so what is typed is sent exactly
 * as typed - the options are a shortcut, not a constraint.
 */
export function SelectOrInput({
  options,
  value,
  onChange,
  placeholder = 'Tanlang',
  searchPlaceholder = 'Tanlang yoki kiriting',
  className,
  disabled,
}: SelectOrInputProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const typed = query.trim()
  const isNew = typed.length > 0 && !options.some((option) => option.toLowerCase() === typed.toLowerCase())

  const pick = (next: string) => {
    onChange(next)
    setQuery('')
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'flex h-9 w-full cursor-pointer items-center justify-between rounded border border-neutral-300 bg-white px-3 py-1 text-base shadow-xs transition-colors',
            'md:text-sm',
            'focus-visible:ring-teal focus-visible:ring-1 focus-visible:outline-none',
            'disabled:text-neutral-450 disabled:cursor-not-allowed disabled:bg-neutral-100',
            className
          )}
        >
          <span className={cn('mr-2 line-clamp-1 flex-1 text-left', !value && 'text-neutral-350')}>
            {value || placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter>
          <CommandInput value={query} onValueChange={setQuery} placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            {!isNew && <CommandEmpty>Maʼlumot topilmadi!</CommandEmpty>}

            {isNew && (
              <CommandGroup>
                <CommandItem value={typed} onSelect={() => pick(typed)}>
                  <Plus className="mr-2 size-4 shrink-0" />
                  <span className="break-words whitespace-normal">«{typed}» ni qo‘shish</span>
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} value={option} onSelect={() => pick(option)}>
                  <Check className={cn('mr-2 size-4 shrink-0', value === option ? 'opacity-100' : 'opacity-0')} />
                  <span className="break-words whitespace-normal">{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SelectOrInput
