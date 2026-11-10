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
  damageArea: 100,
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
})
