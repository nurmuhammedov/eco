import React from 'react'
import { cn } from '@/shared/lib/utils'

interface FilterFieldProps {
  children: React.ReactNode
  className?: string
}
export const FilterField: React.FC<FilterFieldProps> = ({ children, className }) => {
  return <div className={cn('3xl:w-80 w-64 p-1', className)}>{children}</div>
}

export default FilterField
