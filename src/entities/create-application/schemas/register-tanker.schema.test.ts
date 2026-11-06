import { addYears, subDays } from 'date-fns'
import { describe, expect, it } from 'vitest'
import {
  RegisterIllegalTankerSchema,
  TankerAppealDtoSchema,
  UpdateTankerSchema,
  isTankerFileRequired,
  TANKER_FILES,
} from './register-tanker.schema'

const future = addYears(new Date(), 5)

/** Everything every tanker gives, and nothing a kind adds */
const common = {
  phoneNumber: '+998901234567',
  childType: 'TANKER_LPG',
  regionId: '1',
  districtId: '12',
  address: 'Toshkent sh., Chilonzor t., 5-uy',
  location: '41.2995,69.2401',
  numberPlate: '01 a 123 bc',
  model: 'Isuzu NPR',
  factoryNumber: 'ZN-445566',
  factory: 'Samavto',
  capacity: '12',
  environment: 'Propan-butan',
  pressure: '1.6',
  servicePeriod: future,
  labelPath: 'files/label.jpg',
  passportPath: 'files/passport.pdf',
  fitnessConclusionPath: 'files/fitness.pdf',
  fitnessConclusionExpiryDate: future,
  equipmentCertPath: 'files/cert.pdf',
  saleContractPath: 'files/contract.pdf',
  assignmentDecreePath: 'files/decree.pdf',
  driverPermitPath: 'files/driver-permit.pdf',
  driverPermitExpiryDate: future,
}

/** What a pressure tanker adds */
const pressure = {
  partialCheckDate: new Date(2026, 2, 10),
  fullCheckDate: new Date(2026, 2, 10),
  partialCheckPath: 'files/partial.pdf',
  nextPartialCheckDate: future,
  fullCheckPath: 'files/full.pdf',
  nextFullCheckDate: future,
}

const errorPaths = (result: { success: boolean; error?: { issues: { path: (string | number)[] }[] } }) =>
  (result.error?.issues ?? []).map((issue) => issue.path.join('.')).sort()

describe('TankerAppealDtoSchema', () => {
  it('takes a complete LPG tanker and keeps the plate the way the backend stores it', () => {
    const result = TankerAppealDtoSchema.safeParse({ ...common, ...pressure })

    expect(result.success).toBe(true)
    expect(result.data?.numberPlate).toBe('01A123BC')
    expect(result.data?.childType).toBe('TANKER_LPG')
    expect(result.data?.expertisePath).toBeNull()
  })

  it('asks a pressure tanker for both checks and their dates', () => {
    const result = TankerAppealDtoSchema.safeParse(common)

    expect(errorPaths(result)).toEqual(['fullCheckDate', 'fullCheckPath', 'partialCheckDate', 'partialCheckPath'])
  })

  it('asks an oil tanker for the non-destructive check and the cleaning act only', () => {
    const result = TankerAppealDtoSchema.safeParse({ ...common, childType: 'TANKER_OIL' })

    expect(errorPaths(result)).toEqual(['cleaningActPath', 'nonDestructiveCheckDate', 'nonDestructiveCheckPath'])
  })

  it('asks a radioactive tanker for its three documents only', () => {
    const result = TankerAppealDtoSchema.safeParse({ ...common, childType: 'TANKER_RADIOACTIVE' })

    expect(errorPaths(result)).toEqual(['driverRadiationCertPath', 'safetyDecreePath', 'testingActPath'])
  })

  it('wants the expiry date of any file with one that is attached', () => {
    const result = TankerAppealDtoSchema.safeParse({
      ...common,
      ...pressure,
      testingActPath: 'files/act.pdf',
      fitnessConclusionExpiryDate: undefined,
    })

    expect(errorPaths(result)).toEqual(['fitnessConclusionExpiryDate', 'testingActExpiryDate'])
  })

  it('wants the expertise conclusion once the service period is over', () => {
    const expired = { ...common, ...pressure, servicePeriod: subDays(new Date(), 1) }

    expect(errorPaths(TankerAppealDtoSchema.safeParse(expired))).toEqual(['expertisePath'])
    expect(
      TankerAppealDtoSchema.safeParse({
        ...expired,
        expertisePath: 'files/expertise.pdf',
        expertiseExpiryDate: future,
      }).success
    ).toBe(true)
  })

  it('reports the kind-specific gaps together with the plain ones', () => {
    const result = TankerAppealDtoSchema.safeParse({ ...common, numberPlate: '', servicePeriod: undefined })

    expect(errorPaths(result)).toEqual(
      expect.arrayContaining(['numberPlate', 'servicePeriod', 'partialCheckPath', 'fullCheckDate'])
    )
  })
})

describe('the unofficial and the update schemas', () => {
  it('needs the owner on an unofficial application', () => {
    const result = RegisterIllegalTankerSchema.safeParse({ ...common, ...pressure, identity: '' })

    expect(errorPaths(result)).toEqual(['identity'])
  })

  it('keeps the kind rules on an edit but asks for no owner and no phone number', () => {
    const result = UpdateTankerSchema.safeParse({
      ...common,
      ...pressure,
      phoneNumber: '',
      identity: '',
      childType: 'TANKER_OIL',
    })

    expect(errorPaths(result)).toEqual(['cleaningActPath', 'nonDestructiveCheckDate', 'nonDestructiveCheckPath'])
  })
})

describe('isTankerFileRequired', () => {
  const file = (path: string) => TANKER_FILES.find((item) => item.path === path)!

  it('always wants the documents every tanker carries', () => {
    expect(isTankerFileRequired(file('driverPermitPath'), null)).toBe(true)
    expect(isTankerFileRequired(file('labelPath'), 'TANKER_OIL')).toBe(true)
  })

  it('wants a kind document for that kind only', () => {
    expect(isTankerFileRequired(file('testingActPath'), 'TANKER_RADIOACTIVE')).toBe(true)
    expect(isTankerFileRequired(file('testingActPath'), 'TANKER_LPG')).toBe(false)
    expect(isTankerFileRequired(file('fullCheckPath'), 'TANKER_CRYOGENIC')).toBe(true)
  })
})
