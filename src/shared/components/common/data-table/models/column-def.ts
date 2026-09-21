import { ColumnDef } from '@tanstack/react-table'
import { OptionItem } from '@/shared/types/general'
import { DateDisableStrategy } from '@/shared/components/ui/datepicker'

/**
 * The column shape the table and its filter row agree on. It lives apart from
 * the table component because the filter row needs it too, and having the two
 * components import each other left them in a dependency cycle.
 */
export type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  filterKey?: string
  filterType?: 'search' | 'select' | 'date' | 'number' | 'date-range'
  // The lists come straight from the dictionaries, whose ids are numbers.
  filterOptions?: OptionItem<string | number>[]
  filterDateStrategy?: DateDisableStrategy
  filterMaxLength?: number
  filterRangeKeys?: [string, string]
  className?: string
  headerClassName?: string
}
