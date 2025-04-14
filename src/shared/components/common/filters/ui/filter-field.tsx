import React from 'react';
import { cn } from '@/shared/lib/utils';

interface FilterFieldProps {
  children: React.ReactNode;
  className?: string;
}
export const FilterField: React.FC<FilterFieldProps> = ({ children, className }) => {
  return <div className={cn('w-64 3xl:w-80', className)}>{children}</div>;
};

export default FilterField;
