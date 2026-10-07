/** An elevator as the "Xavfsiz lift" register sends it through the IIP push service */
export interface SafeElevator {
  id: string
  externalId: number | null
  serialNumber: string | null
  certificateDate: string | null
  characteristic: string | null
  manufacturer: string | null
  model: string | null
  regionId: number | null
  regionName: string | null
  districtId: number | null
  districtName: string | null
  address: string | null
  floors: number | null
  type: SafeElevatorType | null
  typeName: string | null
  status: number | null
  /** "lat/lng" */
  location: string | null
  elevatorCountEntrance: number | null
  confirmationDate: string | null
  customerTin: number | null
  customerName: string | null
  customerPhone: string | null
  liftingCapacity: number | null
  manufacturedDate: string | null
  maintenanceCompany: string | null
  cadastreNumber: string | null
  applicationId: number | null
  inspectionDate: string | null
  nextInspectionDate: string | null
  externalCreatedAt: string | null
  externalUpdatedAt: string | null
}

export type SafeElevatorType = 'PASSENGER' | 'FREIGHT' | 'HOSPITAL'

export const SAFE_ELEVATOR_TYPE_OPTIONS: { id: SafeElevatorType; name: string }[] = [
  { id: 'PASSENGER', name: 'Yo‘lovchi tashuvchi' },
  { id: 'FREIGHT', name: 'Yuk tashuvchi' },
  { id: 'HOSPITAL', name: 'Kasalxona uchun' },
]

/**
 * What the register's status numbers mean is still being clarified with its owners;
 * until an entry is added here the number itself is shown.
 */
export const SAFE_ELEVATOR_STATUS_NAMES: Record<number, string> = {}

export const safeElevatorStatusName = (status: number | null) =>
  status === null ? null : (SAFE_ELEVATOR_STATUS_NAMES[status] ?? String(status))
