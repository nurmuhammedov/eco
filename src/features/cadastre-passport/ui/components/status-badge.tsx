import { Badge } from '@/shared/components/ui/badge'

const STATUSES: Record<string, { label: string; className: string }> = {
  NEW: { label: 'Yangi', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent' },
  IN_REVIEW: {
    label: 'Kelishishda',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-transparent',
  },
  IN_COMMITTEE: {
    label: 'Qo‘mitada',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent',
  },
  APPROVED: { label: 'Tasdiqlangan', className: 'bg-green-100 text-green-800 hover:bg-green-200 border-transparent' },
  REJECTED: { label: 'Rad etildi', className: 'bg-red-100 text-red-800 hover:bg-red-200 border-transparent' },
  ACTIVE: {
    label: 'Ishchi holatida',
    className: 'bg-green-100 text-green-800 hover:bg-green-200 border-transparent',
  },
  INACTIVE: {
    label: 'Vaqtinchalik ishsiz holatida',
    className: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-transparent',
  },
}

export const STATUS_OPTIONS = ['NEW', 'IN_REVIEW', 'IN_COMMITTEE', 'APPROVED', 'REJECTED'].map((id) => ({
  id,
  name: STATUSES[id].label,
}))

export const StatusBadge = ({ status }: { status: string }) => {
  const match = STATUSES[status] ?? { label: status, className: 'bg-gray-100 text-gray-800 border-transparent' }

  return (
    <Badge variant="outline" className={match.className}>
      {match.label}
    </Badge>
  )
}
