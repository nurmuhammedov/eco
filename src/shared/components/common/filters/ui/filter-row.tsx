import React from 'react';
import { cn } from '@/shared/lib/utils';

interface FilterRowProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterRow: React.FC<FilterRowProps> = ({ children, className }) => {
  return <div className={cn('flex flex-nowrap items-center gap-3', className)}>{children}</div>;
};

export default FilterRow;
