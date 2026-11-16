import { describe, expect, it } from 'vitest'
import { cadastreDataSchema } from './cadastre-data-fields'

const object = {
  name: 'Gaz to‘ldirish punkti',
  belongingName: 'Marxamat',
  belongingType: 'tumani hokimligi',
  regionId: '1',
  regionName: 'Andijon viloyati',
  districtId: '2',
  districtName: 'Marxamat tumani',
  addressLine: 'Mingtepa MFY, Olmazor ko‘chasi, 39-uy',
  longitude: '72.123456',
  latitude: '40.123456',
  cadastreRegistrationNumber: 'QV 123456',
  cadastreRegistrationDate: new Date(2020, 0, 15),
  landCadastreNumber: '18:01:02:03:04:0123',
  landArea: 0.5,
  exploitationYear: '2015',
  purpose: 'Gaz to‘ldirish punkti (GTP)',
  substance: 'Siqilgan tabiiy gaz (metan)',
  hazardLevel: 'II – tip',
  employeeCount: 10,
  workingHour: 24,
  firefightingEquipment: 'OP – 5',
  fireEquipmentCount: 4,
  distanceToFireDepartment: 3,
  dominantHazardType: 'Yong‘in',
  damageArea: '100',
  healthRiskFactor: 'Havodan zaharlanish',
  distanceToNearestObject: 50,
  protectionDistance: '100',
  distanceToResidence: 1,
  estimatedValue: 500,
  status: 'Faol',
}

const passport = {
  objects: [object],
  belongingName: 'Marxamat',
  belongingType: 'tumani hokimligi',
  address: 'Andijon viloyati, Marxamat tumani, Mustaqillik ko‘chasi, 1-uy',
  locationRegionId: '1',
  locationRegionName: 'Andijon viloyati',
  locationDistrictId: '2',
  locationDistrictName: 'Marxamat tumani',
  locationAddressLine: '"Mingtepa" MFY, Olmazor ko‘chasi, 39-uy',
  stateRegistryCertNumber: 'QSH 12345',
  stateRegistryCertDate: new Date(2015, 1, 1),
  okpo: '12345678',
  bankMfo: '00450',
  phoneNumber: '+998901234567',
}

const withoutLocation = Object.fromEntries(Object.entries(passport).filter(([key]) => !key.startsWith('location')))

describe('cadastreDataSchema', () => {
  // The backend asks for preparerData.addressLine since 2026-11-10 and puts it on the title as
  // «Obyektning joylashgan manzili», split on its first two commas.
  it('sends the title’s location as one addressLine, region and district first', () => {
    const result = cadastreDataSchema.safeParse(passport)

    expect(result.success).toBe(true)
    expect(result.data?.addressLine).toBe('Andijon viloyati, Marxamat tumani, "Mingtepa" MFY, Olmazor ko‘chasi, 39-uy')
    expect(Object.keys(result.data ?? {}).filter((key) => key.startsWith('location'))).toEqual([])
  })

  it('leaves the legal address and the objects’ own addresses as they were', () => {
    const result = cadastreDataSchema.safeParse(passport)

    expect(result.data?.address).toBe(passport.address)
    expect(result.data?.objects[0].address).toBe(
      'Andijon viloyati, Marxamat tumani, Mingtepa MFY, Olmazor ko‘chasi, 39-uy'
    )
  })

  it('will not send a passport without its location', () => {
    const result = cadastreDataSchema.safeParse(withoutLocation)

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual(
      expect.arrayContaining(['locationRegionId', 'locationDistrictId', 'locationAddressLine'])
    )
  })

  // Since 2026-11-16 the backend keeps the damage area as text, so a range can be given.
  it('sends the damage area as text, a range with the spaced en dash the passport prints', () => {
    const range = (damageArea: string) =>
      cadastreDataSchema.safeParse({ ...passport, objects: [{ ...object, damageArea }] }).data?.objects[0].damageArea

    expect(range('100')).toBe('100')
    expect(range('10000-50000')).toBe('10000 – 50000')
    expect(range('10000 – 50000')).toBe('10000 – 50000')
    expect(range('12,5 — 40.75')).toBe('12,5 – 40.75')
  })

  it('will not take a damage area that is neither an area nor a range', () => {
    for (const damageArea of ['', 'ko‘p', '100 –', '– 100', '1-2-3']) {
      const result = cadastreDataSchema.safeParse({ ...passport, objects: [{ ...object, damageArea }] })

      expect(result.success, damageArea).toBe(false)
    }
  })

  // Since 2026-11-16 every object carries its own licence and preparerData has none.
  it('sends each object’s licence with the object and none on the passport', () => {
    const result = cadastreDataSchema.safeParse({
      ...passport,
      licenseNumber: 'AB 000001',
      objects: [
        { ...object, licenseNumber: ' AB 001234 ', licenseDate: new Date(2023, 11, 29) },
        { ...object, licenseNumber: '', licenseDate: undefined },
      ],
    })

    expect(result.success).toBe(true)
    expect(result.data?.objects[0]).toMatchObject({ licenseNumber: 'AB 001234', licenseDate: '2023-12-29' })
    expect(result.data?.objects[1].licenseNumber).toBeUndefined()
    expect(result.data?.objects[1].licenseDate).toBeUndefined()
    expect(result.data).not.toHaveProperty('licenseNumber')
    expect(result.data).not.toHaveProperty('licenseDate')
  })
})
