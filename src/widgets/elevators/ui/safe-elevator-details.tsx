import DetailRow from '@/shared/components/common/detail-row'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { getDate } from '@/shared/utils/date'
import { SafeElevator, safeElevatorStatusName } from '@/entities/safe-elevator'

interface SafeElevatorDetailsProps {
  elevator: SafeElevator | null
  onClose: () => void
}

const date = (value: string | null) => (value ? getDate(value) : null)

/** "lat/lng" opened on the map; anything else is left out */
const mapLink = (location: string | null) => {
  const [lat, lng] = (location ?? '').split('/').map((part) => Number(part.trim()))
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null

  return (
    <a
      href={`https://yandex.uz/maps/?pt=${lng},${lat}&z=17&l=map`}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline"
    >
      {lat.toFixed(6)}, {lng.toFixed(6)}
    </a>
  )
}

export const SafeElevatorDetails = ({ elevator, onClose }: SafeElevatorDetailsProps) => (
  <Sheet open={!!elevator} onOpenChange={(open) => !open && onClose()}>
    <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
      <SheetHeader>
        <SheetTitle>Lift: {elevator?.serialNumber ?? '-'}</SheetTitle>
      </SheetHeader>
      {elevator && (
        <div className="flex flex-col gap-1 px-4 pb-4">
          <DetailRow title="Seriya raqami" value={elevator.serialNumber} />
          <DetailRow title="Lift turi" value={elevator.typeName} />
          <DetailRow title="Status" value={safeElevatorStatusName(elevator.status)} />
          <DetailRow title="Buyurtmachi" value={elevator.customerName} />
          <DetailRow title="Buyurtmachi STIR" value={elevator.customerTin} />
          <DetailRow title="Buyurtmachi telefoni" value={elevator.customerPhone} />
          <DetailRow title="Viloyat" value={elevator.regionName} />
          <DetailRow title="Tuman" value={elevator.districtName} />
          <DetailRow title="Manzil" value={elevator.address} />
          <DetailRow title="Lokatsiya" value={mapLink(elevator.location)} />
          <DetailRow title="Kadastr raqami" value={elevator.cadastreNumber} />
          <DetailRow title="Uy qavati" value={elevator.floors} />
          <DetailRow title="Yo‘lakdagi liftlar soni" value={elevator.elevatorCountEntrance} />
          <DetailRow title="Ishlab chiqaruvchi" value={elevator.manufacturer} />
          <DetailRow title="Model" value={elevator.model} />
          <DetailRow title="Xarakteristikasi" value={elevator.characteristic} />
          <DetailRow
            title="Yuk ko‘taruvchanligi"
            value={elevator.liftingCapacity !== null ? `${elevator.liftingCapacity} kg` : null}
          />
          <DetailRow title="Ishlab chiqarilgan sana" value={date(elevator.manufacturedDate)} />
          <DetailRow title="Sertifikat berilgan sana" value={date(elevator.certificateDate)} />
          <DetailRow title="Tasdiqlash sanasi" value={date(elevator.confirmationDate)} />
          <DetailRow title="Texnik xizmat ko‘rsatuvchi" value={elevator.maintenanceCompany} />
          <DetailRow title="Texnik ko‘rik sanasi" value={date(elevator.inspectionDate)} />
          <DetailRow title="Keyingi texnik ko‘rik sanasi" value={date(elevator.nextInspectionDate)} />
          <DetailRow title="Ariza ID (Xavfsiz lift)" value={elevator.applicationId} />
          <DetailRow title="Xavfsiz lift tizimidagi ID" value={elevator.externalId} />
          <DetailRow title="Xavfsiz liftda o‘zgartirilgan" value={date(elevator.externalUpdatedAt)} />
        </div>
      )}
    </SheetContent>
  </Sheet>
)
