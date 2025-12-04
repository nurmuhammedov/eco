import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, X } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'

export type MultiSelectOption = {
  name: string
  id: string | number
  disabled?: boolean
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  className?: string
  maxDisplayItems?: number
  placeholder?: string
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, value = [], onChange, className, placeholder = 'Select options...', maxDisplayItems = 2 }, ref) => {
    const { t } = useTranslation('common')
    const [open, setOpen] = React.useState(false)

    const handleSelect = (optionId: string | number) => {
      if (!onChange) return
      const newValue = value.includes(optionId) ? value.filter((id) => id !== optionId) : [...value, optionId]
      onChange(newValue)
    }

    const selectedOptions = options.filter((option) => value.includes(option.id))

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('h-auto min-h-10 w-full justify-between', className)}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.length > maxDisplayItems ? (
                  <span className="text-muted-foreground text-sm">
                    {t('selected_items_count', { count: selectedOptions.length })}
                  </span>
                ) : (
                  selectedOptions.map((option) => (
                    <div
                      key={option.id}
                      className="bg-muted flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium"
                    >
                      {option.name}
                      <button
                        type="button"
                        aria-label={`Remove ${option.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelect(option.id)
                        }}
                        className="ring-offset-background ml-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={t('Qidirish...') || 'Qidirish...'} />
            <CommandList>
              <CommandEmpty>{t('Maʼlumotlar topilmadi!') || 'Natija topilmadi!'}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      handleSelect(option.id)
                    }}
                    className="cursor-pointer"
                  >
                    <Check className={cn('mr-2 h-4 w-4', value.includes(option.id) ? 'opacity-100' : 'opacity-0')} />
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
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
