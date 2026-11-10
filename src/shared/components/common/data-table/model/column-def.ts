import { ColumnDef } from '@tanstack/react-table'
import { OptionItem } from '@/shared/types/general'
import { DateDisableStrategy } from '@/shared/components/ui/datepicker'

/**
 * The column shape the table and its filter row agree on. It lives apart from
 * the table component because the filter row needs it too, and having the two
 * components import each other left them in a dependency cycle.
 */
export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  /** A header group; its columns take the same extras as any other */
  columns?: ExtendedColumnDef<TData, TValue>[]
  filterKey?: string
  filterType?: 'search' | 'select' | 'date' | 'number' | 'date-range'
  // The lists come straight from the dictionaries, whose ids are numbers.
  filterOptions?: OptionItem<string | number>[]
  filterDateStrategy?: DateDisableStrategy
  filterMaxLength?: number
  filterRangeKeys?: [string, string]
  /**
   * Params a value in this filter clears: filters that feed one backend
   * parameter take turns, so only the one in use shows a value
   */
  filterClearKeys?: string[]
  className?: string
  headerClassName?: string
}
