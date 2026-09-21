import { Badge } from '@/shared/components/ui/badge'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { RegistryRow } from './types'

/**
 * Shown on the "change requests" tab of every register. The four lists carried
 * a copy each, differing only in the status prefix they happened to name - so a
 * register added later showed a dash where the others showed a badge.
 */
const REQUEST_BADGES = [
  { match: (type: string) => type.startsWith('UPDATE'), variant: 'info', label: 'Ma’lumotlarni o‘zgartirish' },
  { match: (type: string) => type.startsWith('DEREGISTER'), variant: 'destructive', label: 'Reyestrdan chiqarish' },
  {
    match: (type: string) => type.startsWith('CHANGE_') && type.includes('_STATUS'),
    variant: 'warning',
    label: 'Holatini o‘zgartirish',
  },
] as const

export const changeTypeColumn = <TRow extends RegistryRow>(): ExtendedColumnDef<TRow, unknown> => ({
  header: 'So‘rov turi',
  accessorKey: 'changeBelongType',
  cell: ({ row }) => {
    const type = row.original.changeBelongType
    const badge = type ? REQUEST_BADGES.find(({ match }) => match(type)) : undefined

    if (!badge) return '-'

    return (
      <Badge variant={badge.variant} className="py-1">
        {badge.label}
      </Badge>
    )
  },
})
