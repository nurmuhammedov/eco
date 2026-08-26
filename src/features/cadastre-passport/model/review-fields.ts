import { z } from 'zod'
import { format } from 'date-fns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

/**
 * The attributive tables FVV and SES fill in when they sign, taken from
 * "ТХЮЗга ФВВ ва СЭС жадвали". Every one is optional on the backend, so the
 * list is data rather than forty hand-written FormFields: the same spec drives
 * the sign dialog, the later edit dialog and the read-only rows.
 */
export type ReviewFieldType = 'text' | 'int' | 'decimal' | 'date' | 'select'

export interface ReviewField {
  name: string
  label: string
  type: ReviewFieldType
  /** What the date can be: something already recorded, or a deadline ahead. */
  dates?: 'past' | 'future'
  /** Backed by an enum on the server, which rejects anything outside the list. */
  options?: string[]
}

export interface ReviewGroup {
  title: string
  fields: ReviewField[]
}

export const FVV_GROUPS: ReviewGroup[] = [
  {
    title: 'Odamlarni evakuatsiya qilishni talab qiladigan texnogen xavfi yuqori zonalar',
    fields: [
      { name: 'dailyEmployeeCount', label: 'Obyektda xodimlarning soni (bir sutka davomida)', type: 'int' },
      { name: 'sanitaryZone', label: 'Obyektning sanitar zonasi', type: 'text' },
      { name: 'potentiallyAffectedPeopleCount', label: 'Zararlanishi mumkin bo‘lgan odamlar soni', type: 'int' },
      { name: 'lightVehiclesCount', label: 'Yengil avtomobillar', type: 'text' },
      { name: 'heavyVehiclesCount', label: 'Yuk avtomashinalari', type: 'text' },
      { name: 'busesCount', label: 'Avtobuslar', type: 'text' },
      { name: 'bulldozersCount', label: 'Buldozerlar', type: 'text' },
      { name: 'otherVehiclesCount', label: 'Boshqalar', type: 'text' },
      { name: 'protectiveGear', label: 'Gaz niqobi, himoya kaskasi', type: 'text' },
      { name: 'notificationStatus', label: 'Xabar berish holati', type: 'text' },
      { name: 'evacuationAddress', label: 'Evakuatsiya manzili', type: 'text' },
      {
        name: 'evacuationInvolvedPeopleCount',
        label: 'Evakuatsiyaga jalb qilinadigan odamlar soni',
        type: 'int',
      },
    ],
  },
  {
    title: 'Portlash va yong‘in chiqishi xavfi yuqori zonalar (obyektlar)',
    fields: [
      {
        name: 'fireExplosionCategory',
        label: 'Portlash yong‘in xavfi bo‘yicha toifasi',
        type: 'select',
        options: ['A', 'B', 'V', 'G', 'D'],
      },
      {
        name: 'fireResistanceClass',
        label: 'Yong‘inga bardoshlik darajasi bo‘yicha sinfi',
        type: 'select',
        options: ['I', 'II', 'III', 'IV'],
      },
      { name: 'combustibleProductName', label: 'Obyektda yonuvchi mahsulot nomi', type: 'text' },
      { name: 'floorsCount', label: 'Qavatlar soni', type: 'int' },
      { name: 'distanceToNearestWater', label: 'Eng yaqin suv manbalarigacha masofa (km)', type: 'decimal' },
      { name: 'distanceToDistrictFireDept', label: 'Obyektdan tuman YoXB gacha masofa (km)', type: 'decimal' },
      {
        name: 'automaticFireAlarmArea',
        label: 'Yong‘in haqida avtomatik xabar berish qurilmasi (himoyalash maydoni, m²)',
        type: 'text',
      },
      { name: 'voiceAlarmSystem', label: 'Ovozli xabarlash tizimi', type: 'text' },
      { name: 'emergencyFireSystem', label: 'Avariyaviy yoki qutqaruv yoritish tizimi', type: 'text' },
      { name: 'primaryFireEquipment', label: 'Birlamchi yong‘in o‘chirish vositalarining mavjudligi', type: 'text' },
      { name: 'fireTrucksCount', label: 'Yong‘in o‘chirish avtomobillari soni', type: 'int' },
      { name: 'specialVehiclesCount', label: 'Maxsus avtomobillar soni', type: 'int' },
      { name: 'heatingSystemType', label: 'Isitish tizimining turi', type: 'text' },
      { name: 'fireExtinguishingAgentType', label: 'Yong‘in o‘chirish moddasining turi', type: 'text' },
      { name: 'smokeExtractionSystem', label: 'Tutun tortish tizimi', type: 'text' },
      { name: 'airSupplySystem', label: 'Havo berish tizimi', type: 'text' },
      { name: 'protectionArea', label: 'Himoya maydoni (ga da)', type: 'decimal' },
      { name: 'fireHydrantsCount', label: 'Yong‘in o‘chirish jumraklari soni', type: 'int' },
      { name: 'waterConsumption', label: 'Sarfi (l/s)', type: 'decimal' },
      { name: 'pumpsCount', label: 'Nasoslar soni', type: 'int' },
      { name: 'pumpCapacity', label: 'Nasoslarning quvvati (l/s)', type: 'decimal' },
    ],
  },
]

export const SES_GROUPS: ReviewGroup[] = [
  {
    title: 'Kuchli ta’sir qiluvchi zaharli ximikatlar, pestitsidlar va boshqa moddalar bilan ishlovchi obyektlar',
    fields: [
      { name: 'responsiblePerson', label: 'Xavfsizlik bo‘yicha mas’ul shaxs (F.I.Sh.)', type: 'text' },
      {
        name: 'annualProductionCapacity',
        label: 'Ishlab chiqarish, qayta ishlash, saqlash va foydalanish moddalarining bir yillik quvvati',
        type: 'text',
      },
      { name: 'hazardLevel', label: 'Xavflilik darajasi', type: 'text' },
      { name: 'productStorageLocation', label: 'Mahsulot saqlanadigan joyi', type: 'text' },
      { name: 'sanitaryPassportDate', label: 'Sanitariya pasporti berilgan sana', type: 'date', dates: 'past' },
      {
        name: 'sanitaryPassportExpiryDate',
        label: 'Sanitariya pasporti amal qilish muddati',
        type: 'date',
        dates: 'future',
      },
      {
        name: 'conservationOrReconstructionInfo',
        label: 'Konservatsiya yoki rekonstruksiya ishlari to‘g‘risida ma’lumotlar',
        type: 'text',
      },
    ],
  },
]

export const reviewFieldsOf = (groups: ReviewGroup[]) => groups.flatMap((group) => group.fields)

const optionalOf = (type: ReviewFieldType) => {
  if (type === 'date') return z.date().optional()
  if (type === 'text' || type === 'select') return z.string().optional()

  // InputNumber keeps a number in the form and clears to undefined.
  return z.number({ invalid_type_error: FORM_ERROR_MESSAGES.invalid }).optional()
}

/** Everything here is optional, so the shape only has to survive an empty form. */
export const reviewShape = (groups: ReviewGroup[]) =>
  Object.fromEntries(reviewFieldsOf(groups).map((field) => [field.name, optionalOf(field.type)])) as Record<
    string,
    z.ZodTypeAny
  >

export const reviewDefaults = (groups: ReviewGroup[]) =>
  Object.fromEntries(
    reviewFieldsOf(groups).map((field) => [
      field.name,
      field.type === 'text' || field.type === 'select' ? '' : undefined,
    ])
  )

/**
 * Blank optionals are left out rather than sent as empty strings, which the
 * integer and decimal columns would reject.
 */
export const toReviewPayload = (groups: ReviewGroup[], values: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {}

  for (const field of reviewFieldsOf(groups)) {
    const raw = values[field.name]
    if (raw === undefined || raw === null || raw === '') continue

    if (field.type === 'date') {
      payload[field.name] = format(raw as Date, 'yyyy-MM-dd')
      continue
    }

    const text = typeof raw === 'number' ? String(raw) : (raw as string)

    if (field.type === 'int') payload[field.name] = parseInt(text, 10)
    else if (field.type === 'decimal') payload[field.name] = Number(text)
    else payload[field.name] = text
  }

  return payload
}

/** Turns an API response back into form values so the edit dialog opens filled in. */
export const fromReviewPayload = (groups: ReviewGroup[], source: Record<string, any> | undefined | null) => {
  const values: Record<string, unknown> = {}

  for (const field of reviewFieldsOf(groups)) {
    const value = source?.[field.name]

    if (field.type === 'date') values[field.name] = value ? new Date(value) : undefined
    else values[field.name] = value === null || value === undefined ? '' : String(value)
  }

  return values
}
