import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';

/**
 * Type definitions for multi-select options
 */
export type MultiSelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
};

/**
 * MultiSelect component for selecting multiple values from a dropdown
 * Designed to work seamlessly with react-hook-form
 */
const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  {
    options: MultiSelectOption[];
    placeholder?: string;
    value?: Array<string | number>;
    onChange?: (value: Array<string | number>) => void;
    disabled?: boolean;
    maxDisplayItems?: number;
    className?: string;
    name?: string;
    onBlur?: () => void;
  }
>((props, ref) => {
  const {
    options,
    value = [],
    onChange,
    onBlur,
    disabled = false,
    placeholder = 'Select options',
    maxDisplayItems = 2,
    className,
    name,
    ...restProps
  } = props;

  const [open, setOpen] = React.useState(false);

  // Get selected items for display
  const selectedOptions = React.useMemo(
    () => options.filter((opt) => value.includes(opt.value)),
    [options, value],
  );

  // Handle selection of an item
  const handleSelect = React.useCallback(
    (itemValue: string | number) => {
      if (!onChange) return;

      const currentIndex = value.findIndex((v) => v === itemValue);
      let newValue: Array<string | number>;

      if (currentIndex >= 0) {
        // Remove if already selected
        newValue = [...value];
        newValue.splice(currentIndex, 1);
      } else {
        // Add if not selected
        newValue = [...value, itemValue];
      }

      // MUHIM: Validatsiya uchun maxsus shakl
      onChange(newValue);

      // Validatsiyani ishga tushirish uchun
      if (onBlur) {
        requestAnimationFrame(() => {
          onBlur();
        });
      }
    },
    [onChange, value, onBlur],
  );

  // Handle clearing all selections
  const handleClearAll = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.([]);

      // Validatsiyani ishga tushirish
      if (onBlur) {
        requestAnimationFrame(() => {
          onBlur();
        });
      }
    },
    [onChange, onBlur],
  );

  // Handle removing a specific item
  const handleRemoveItem = React.useCallback(
    (e: React.MouseEvent, itemValue: string | number) => {
      e.stopPropagation();
      const newValue = value.filter((v) => v !== itemValue);
      onChange?.(newValue);

      // Validatsiyani ishga tushirish
      if (onBlur) {
        requestAnimationFrame(() => {
          onBlur();
        });
      }
    },
    [onChange, value, onBlur],
  );

  // Display text based on selected items
  const displayText = React.useMemo(() => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (selectedOptions.length <= maxDisplayItems) {
      return (
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {selectedOptions.map((option) => (
            <div
              key={option.value.toString()}
              className="flex items-center gap-1 rounded-sm bg-muted px-1 py-0.5 text-xs"
            >
              {option.icon &&
                React.createElement(option.icon, { className: 'size-3 mr-1' })}
              <span className="truncate">{option.label}</span>
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => handleRemoveItem(e, option.value)}
              >
                <X className="size-3" />
                <span className="sr-only">Remove {option.label}</span>
              </button>
            </div>
          ))}
        </div>
      );
    }

    return <span>{selectedOptions.length} items selected</span>;
  }, [selectedOptions, placeholder, maxDisplayItems, handleRemoveItem]);

  return (
    <SelectPrimitive.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onBlur?.();
      }}
    >
      <SelectPrimitive.Trigger
        ref={ref}
        id={name}
        name={name}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...restProps}
      >
        <div className="flex flex-1 flex-wrap gap-1 overflow-hidden">
          {displayText}
        </div>
        <div className="flex items-center self-stretch pl-1">
          {!!value.length && (
            <button
              type="button"
              onClick={handleClearAll}
              className="mr-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="size-4" />
              <span className="sr-only">Clear all</span>
            </button>
          )}
          <ChevronDown className="size-4 opacity-50" />
        </div>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          className={cn(
            'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          )}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <div
                key={option.value.toString()}
                className={cn(
                  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  value.includes(option.value) && 'bg-accent/50',
                )}
                onClick={() => handleSelect(option.value)}
              >
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                  {value.includes(option.value) && <Check className="size-3" />}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {option.icon &&
                    React.createElement(option.icon, { className: 'size-4' })}
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
            {options.length === 0 && (
              <div className="py-6 text-center text-sm">
                No options available
              </div>
            )}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});

MultiSelect.displayName = 'MultiSelect';

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));

SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));

SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export { MultiSelect };
