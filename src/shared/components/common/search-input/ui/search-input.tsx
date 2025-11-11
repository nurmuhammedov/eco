// import * as React from 'react';
// import { cn } from '@/shared/lib/utils';
// import { SearchIcon, XIcon } from 'lucide-react';
// import { Input } from '@/shared/components/ui/input';
//
// export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
//   isLoading?: boolean;
//   onClear?: () => void;
//   onChange?: (value: string) => void;
// }
//
// export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
//   ({ onChange, onClear, className, isLoading, ...props }, ref) => {
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       onChange?.(e.target.value);
//     };
//
//     const handleClear = () => {
//       if (ref && 'current' in ref && ref.current) {
//         ref.current.value = '';
//       }
//       onClear?.();
//       onChange?.('');
//     };
//
//     const showClearButton = ref && 'current' in ref && ref.current?.value;
//
//     return (
//       <div className="relative">
//         <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
//
//         <Input
//           ref={ref}
//           disabled={isLoading}
//           onChange={handleChange}
//           className={cn('pl-9', showClearButton && 'pr-9', className)}
//           {...props}
//         />
//
//         {showClearButton && (
//           <button
//             type="button"
//             disabled={isLoading}
//             onClick={handleClear}
//             aria-label="Tozalash"
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
//           >
//             <XIcon size={16} />
//           </button>
//         )}
//       </div>
//     );
//   },
// );
//
// SearchInput.displayName = 'SearchInput';
//
// export default SearchInput;

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  isLoading?: boolean;
  onClear?: () => void;
  onChange?: (value: string) => void;
  /** Style variant: "default" (with icons) | "underline" (no icons, bottom border only) */
  variant?: 'default' | 'underline';
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange, onClear, className, isLoading, variant = 'default', ...props }, ref) => {
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

    const showClearButton = variant === 'default' && ref && 'current' in ref && ref.current?.value;

    return (
      <div
        className={cn(
          'relative w-full',
          variant === 'underline' && 'border-b border-neutral-300 focus-within:border-neutral-600',
        )}
      >
        {variant === 'default' && (
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
        )}

        <Input
          ref={ref}
          disabled={isLoading}
          onChange={handleChange}
          className={cn(
            variant === 'default'
              ? cn('pl-9', showClearButton && 'pr-9')
              : cn(
                  'border-none rounded-none shadow-none px-0',
                  'focus-visible:ring-0 focus-visible:outline-none bg-transparent',
                ),
            className,
          )}
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
