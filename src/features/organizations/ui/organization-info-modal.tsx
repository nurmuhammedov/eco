import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useOrganizationInfoQuery } from '@/entities/organizations'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { ReactNode } from 'react'
import { EmptyValue } from '@/shared/components/common/empty-value'

interface OrganizationInfoModalProps {
  tin: string | null
  onClose: () => void
}

const InfoRow = ({ title, value }: { title: string; value: ReactNode }) => (
  <div className="grid grid-cols-1 gap-1 rounded-md px-3 py-2 odd:bg-neutral-50 md:grid-cols-2 md:items-center md:gap-4">
    <span className="text-sm font-medium text-gray-500">{title}</span>
    <div className="text-sm font-medium break-words text-gray-900">{value || <EmptyValue />}</div>
  </div>
)

export function OrganizationInfoModal({ tin, onClose }: OrganizationInfoModalProps) {
  const { data, isLoading } = useOrganizationInfoQuery(tin)

  const rows: { title: string; value: ReactNode }[] = [
    { title: 'Tashkilot nomi:', value: data?.legalName },
    { title: 'Rahbar F.I.SH.:', value: data?.fullName },
    ...(data?.pin ? [{ title: 'JSHSHIR:', value: data.pin }] : [{ title: 'STIR:', value: data?.tin }]),
    { title: 'Telefon raqami:', value: data?.phoneNumber },
    { title: 'Viloyat:', value: data?.regionName },
    { title: 'Tuman/shahar:', value: data?.districtName },
    { title: 'Yuridik manzil:', value: data?.legalAddress },
  ]

  return (
    <Dialog open={!!tin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg">
        <DialogHeader className="mb-2">
          <DialogTitle>Tashkilot ma’lumotlari</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col gap-1">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="grid grid-cols-2 items-center gap-4 rounded-md px-3 py-2 odd:bg-neutral-50">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
        ) : !data ? (
          <div className="py-6 text-center text-sm font-medium text-gray-500">Ma’lumot topilmadi</div>
        ) : (
          <div className="flex flex-col">
            {rows.map((row) => (
              <InfoRow key={row.title} title={row.title} value={row.value} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
