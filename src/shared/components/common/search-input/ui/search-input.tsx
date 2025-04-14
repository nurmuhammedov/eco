import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  isLoading?: boolean;
  onClear?: () => void;
  onChange?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange, onClear, className, isLoading, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleClear = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.value = '';
      }
      onClear?.();
      onChange?.('');
    };

    const showClearButton = ref && 'current' in ref && ref.current?.value;

    return (
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />

        <Input
          ref={ref}
          disabled={isLoading}
          onChange={handleChange}
          className={cn('pl-9', showClearButton && 'pr-9', className)}
          {...props}
        />

        {showClearButton && (
          <button
            type="button"
            disabled={isLoading}
            onClick={handleClear}
            aria-label="Tozalash"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
