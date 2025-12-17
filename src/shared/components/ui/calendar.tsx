import * as React from 'react'
import { DayPicker, DropdownProps } from 'react-day-picker'
import { uz } from 'date-fns/locale'
import { buttonVariants } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const calculateDefaultMonth = () => {
    if (props.defaultMonth) return props.defaultMonth
    if (props.selected instanceof Date) return props.selected
    return undefined
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      locale={uz}
      captionLayout="dropdown-buttons"
      fromYear={1900}
      toYear={new Date().getFullYear() + 100}
      defaultMonth={calculateDefaultMonth()}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium hidden',
        caption_dropdowns: 'flex justify-center gap-1',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 cursor-pointer'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({ value, onChange, children, name }: DropdownProps) => {
          const options = React.Children.toArray(children) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[]
          const selected = options.find((child) => child.props.value === value)
          const [open, setOpen] = React.useState(false)

          const handleChange = (newValue: string) => {
            const changeEvent = {
              target: { value: newValue },
            } as React.ChangeEvent<HTMLSelectElement>
            onChange?.(changeEvent)
            setOpen(false)
          }

          const isYearDropdown = name === 'years'

          return (
            <Popover modal={true} open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'flex h-7 cursor-pointer items-center justify-between rounded-md px-2 py-1 text-sm font-medium focus:outline-none',
                    'text-foreground bg-transparent',
                    'hover:bg-accent hover:text-accent-foreground border border-transparent',
                    open && 'bg-accent text-accent-foreground'
                  )}
                >
                  {selected?.props?.children}
                  <ChevronLeft
                    className={cn('ml-1 h-4 w-4 rotate-[-90deg] opacity-50 transition', open && 'rotate-90')}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="z-[65] w-[140px] p-0" align="center">
                <Command
                  filter={
                    isYearDropdown
                      ? (value, search) => {
                          if (value.startsWith(search)) return 1
                          return 0
                        }
                      : undefined
                  }
                >
                  <CommandInput hideIcon={true} placeholder="Qidirish..." className="h-9 pl-5" />

                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>Topilmadi</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const label = String(option.props.children as string | number)
                        const optionValue = option.props.value

                        return (
                          <CommandItem
                            key={String(optionValue)}
                            value={label}
                            onSelect={() => {
                              if (optionValue !== undefined && optionValue !== null) {
                                handleChange(String(optionValue))
                              }
                            }}
                            className="pr-1 pl-1"
                          >
                            <div
                              className={cn(
                                'mr-2 flex h-4 w-4 shrink-0 items-center justify-center',
                                value === optionValue ? 'opacity-100' : 'opacity-0'
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                            {label}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )
        },
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
