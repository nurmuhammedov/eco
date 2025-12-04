import React, { Fragment } from 'react'
import { Badge } from '../ui/badge'
import { cn } from '@/shared/lib/utils.ts'
import { Skeleton } from '@/shared/components/ui/skeleton.tsx'
import { Separator } from '@/shared/components/ui/separator.tsx'

// Description Item component for displaying each field
export const DescriptionItem = React.forwardRef<
  HTMLDivElement,
  {
    label: React.ReactNode
    children?: React.ReactNode
    span?: number
    valueType?: 'text' | 'date' | 'status' | 'tags' | 'email' | 'phone'
    formatter?: (value: any) => React.ReactNode
    className?: string
  }
>(({ label, children, span = 1, valueType = 'text', formatter, className }, ref) => {
  // Format the value based on type
  const formattedValue = React.useMemo(() => {
    if (formatter) return formatter(children)
    if (children === undefined || children === null) return '-'

    switch (valueType) {
      case 'date':
        return new Date(children as string).toLocaleString()
      case 'status':
        return <Badge variant={children === 'active' ? 'default' : 'secondary'}>{children}</Badge>
      case 'tags':
        if (!Array.isArray(children)) return children
        return (
          <div className="flex flex-wrap gap-1">
            {children.map((tag, i) => (
              <Badge key={i} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )
      default:
        return children
    }
  }, [children, formatter, valueType])

  return (
    <div ref={ref} className={cn(span > 1 ? `col-span-${span}` : 'col-span-1', className)}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 font-medium">{formattedValue}</div>
    </div>
  )
})
DescriptionItem.displayName = 'DescriptionItem'

// Main Description component
export function Description({
  title,
  extra,
  bordered = false,
  column = 1,
  loading = false,
  children,
  className,
}: {
  title?: React.ReactNode
  extra?: React.ReactNode
  bordered?: boolean
  column?: number
  size?: 'small' | 'default' | 'large'
  loading?: boolean
  children: React.ReactNode
  className?: string
}) {
  // Responsive column grid
  const grid = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[Math.min(4, Math.max(1, column))]

  // Render loading skeleton if needed
  if (loading) {
    return (
      <div className={cn('w-full space-y-4', bordered && 'rounded-md border', className)}>
        {title && (
          <Fragment>
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              {extra && <Skeleton className="h-9 w-24" />}
            </div>
            <Separator className="mb-4" />
          </Fragment>
        )}
        <div className={cn('grid gap-4', grid)}>
          {Array.from({ length: column * 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', bordered && 'rounded-md border', className)}>
      {title && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-lg font-medium">{title}</div>
            {extra && <div>{extra}</div>}
          </div>
          <Separator className="mb-4" />
        </>
      )}
      <div className={cn('grid gap-4', grid)}>{children}</div>
    </div>
  )
}

// Add Item as a subcomponent for better DX
Description.Item = DescriptionItem
