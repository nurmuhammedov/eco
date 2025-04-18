import { cn } from '@/shared/lib/utils';
import { PhoneIcon } from 'lucide-react';
import React, { forwardRef } from 'react';
import { Input } from '@/shared/components/ui/input';

// Uzbekistan phone number validation pattern
const UZ_PHONE_PATTERN = /^\+998\d{0,9}$/;

// Extending the InputProps type for our custom props
type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showIcon?: boolean;
  showCountryCode?: boolean;
  onValueChange?: (value: string) => void;
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, onValueChange, showIcon = false, showCountryCode = true, ...props }, ref) => {
    // Handle controlled input with formatting
    const formatPhoneNumber = (value: string): string => {
      // If empty, return empty or country code
      if (!value) return showCountryCode ? '+998' : '';

      // Add country code if missing and enabled
      if (showCountryCode && !value.startsWith('+998')) {
        value = '+998' + value.replace(/\D/g, '');
      }

      // Only allow digits after country code
      value = value.replace(/[^\d+]/g, '');

      // Validate the pattern
      if (!UZ_PHONE_PATTERN.test(value)) {
        // Keep only what matches the pattern
        if (value.startsWith('+998')) {
          value = '+998' + value.substring(4).slice(0, 9);
        } else {
          value = value.slice(0, 9);
        }
      }

      return value;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);

      // Create a new synthetic event with the formatted value
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: formattedValue },
      } as React.ChangeEvent<HTMLInputElement>;

      // Call the original onChange if provided
      onChange?.(syntheticEvent);

      // Call the onValueChange callback if provided
      onValueChange?.(formattedValue);
    };

    return (
      <div className="relative">
        {showIcon && (
          <PhoneIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4"
            aria-hidden="true"
          />
        )}

        <Input
          {...props}
          ref={ref}
          type="tel"
          className={cn(
            showIcon && 'pl-9', // Add padding for the icon
            className,
          )}
          onChange={handleInputChange}
          value={formatPhoneNumber((value as string) || '')}
          placeholder={props.placeholder || '+998 XX XXX XX XX'}
        />
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
export { PhoneInput };
