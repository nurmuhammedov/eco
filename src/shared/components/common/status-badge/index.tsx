import * as React from 'react';
import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { ApplicationStatus } from '@/shared/types/enums';
import { cva, type VariantProps } from 'class-variance-authority';

const statusBadgeVariants = cva(
  'px-2 py-1 rounded-lg text-xs 3xl:text-sm font-semibold shadow-none',
  {
    variants: {
      status: {
        [ApplicationStatus.NEW]: 'bg-blue-100 text-blue-700',
        [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-500',
        [ApplicationStatus.PROCESS]: 'bg-yellow-100 text-yellow-200',
        [ApplicationStatus.AGREEMENT]: 'bg-green-100 text-green-400',
        [ApplicationStatus.CONFIRMATION]: 'bg-neutral-110 text-neutral-860',
      },
    },
    defaultVariants: { status: ApplicationStatus.NEW },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: ReactNode;
  status: ApplicationStatus;
}

export const StatusBadge = ({
  children,
  status,
  className,
  ...props
}: StatusBadgeProps) => {
  return (
    <Badge
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {children}
    </Badge>
  );
};
