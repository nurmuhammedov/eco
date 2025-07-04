import * as React from 'react';
import { Fragment } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-blue-400 text-primary-foreground shadow-sm hover:bg-blue-400/90',
        success: 'bg-[#2ECD56] text-primary-foreground shadow-sm hover:bg-[#2ECD56]/90',
        successOutline:
          'border border-[#2ECD56] bg-background text-[#2ECD56] shadow-xs hover:bg-[#2ECD56] hover:text-white',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        destructiveOutline:
          'bg-background  border border-destructive text-destructive shadow-xs hover:bg-destructive/90 hover:text-white',
        outline: 'border border-neutral-300 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        info: 'border border-[#4E75FF] bg-[#DCE4FF] shadow-xs hover:bg-[#DCE4FF] text-[#4E75FF]',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-8 2xl:size-9',
        iconSm: 'size-6 2xl:size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          'opacity-50 cursor-not-allowed': loading,
        })}
        ref={ref}
        aria-live="polite"
        aria-busy={loading}
        disabled={props.disabled || loading}
        {...props}
      >
        <Fragment>
          {loading && <Loader className="animate-spin size-4" />}
          {children}
        </Fragment>
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
