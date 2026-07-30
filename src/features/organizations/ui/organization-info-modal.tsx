import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useOrganizationInfoQuery } from '@/entities/organizations'
import { Loader2 } from 'lucide-react'

interface OrganizationInfoModalProps {
  tin: string | null
  onClose: () => void
}

export function OrganizationInfoModal({ tin, onClose }: OrganizationInfoModalProps) {
  const { data, isLoading } = useOrganizationInfoQuery(tin)

  return (
    <Dialog open={!!tin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tashkilot ma'lumotlari</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : !data ? (
            <div className="text-center text-gray-500">Ma'lumot topilmadi</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-semibold">Nomi:</div>
              <div>{data.name || '-'}</div>

              <div className="font-semibold">STIR:</div>
              <div>{data.tin || data.identity || '-'}</div>

              <div className="font-semibold">Manzil:</div>
              <div>{data.address || '-'}</div>

              {Object.entries(data).map(([key, value]) => {
                if (['name', 'tin', 'identity', 'address'].includes(key)) return null
                if (typeof value === 'object') return null
                return (
                  <div key={key} className="contents">
                    <div className="font-semibold capitalize">{key}:</div>
                    <div>{String(value || '-')}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
