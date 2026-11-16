import { addYears, subDays } from 'date-fns'
import { describe, expect, it } from 'vitest'
import {
  RegisterIllegalTankerSchema,
  TankerAppealDtoSchema,
  UpdateTankerSchema,
  isTankerFileApplicable,
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

  it('asks a pressure tanker for the dates of both checks, not for their files', () => {
    const result = TankerAppealDtoSchema.safeParse(common)

    expect(errorPaths(result)).toEqual(['fullCheckDate', 'partialCheckDate'])
  })

  it('asks an oil tanker for the date of the non-destructive check only', () => {
    const result = TankerAppealDtoSchema.safeParse({ ...common, childType: 'TANKER_OIL' })

    expect(errorPaths(result)).toEqual(['nonDestructiveCheckDate'])
  })

  it('takes a radioactive tanker without its documents', () => {
    expect(TankerAppealDtoSchema.safeParse({ ...common, childType: 'TANKER_RADIOACTIVE' }).success).toBe(true)
  })

  // Since 2026-11-16 no file is required: the tankers moved over from the old register come without them
  it('takes a tanker without a single file', () => {
    const files = Object.fromEntries(TANKER_FILES.map((file) => [file.path, undefined]))
    const result = TankerAppealDtoSchema.safeParse({
      ...common,
      ...pressure,
      ...files,
      fitnessConclusionExpiryDate: undefined,
      driverPermitExpiryDate: undefined,
      nextPartialCheckDate: undefined,
      nextFullCheckDate: undefined,
    })

    expect(result.success).toBe(true)
    expect(TANKER_FILES.map((file) => result.data?.[file.path])).toEqual(TANKER_FILES.map(() => null))
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

  it('takes an expired service period without the expertise conclusion, and with it', () => {
    const expired = { ...common, ...pressure, servicePeriod: subDays(new Date(), 1) }

    expect(TankerAppealDtoSchema.safeParse(expired).success).toBe(true)
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
      expect.arrayContaining(['numberPlate', 'servicePeriod', 'partialCheckDate', 'fullCheckDate'])
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

    expect(errorPaths(result)).toEqual(['nonDestructiveCheckDate'])
  })
})

describe('isTankerFileApplicable', () => {
  const file = (path: string) => TANKER_FILES.find((item) => item.path === path)!

  it('always shows the documents every tanker has', () => {
    expect(isTankerFileApplicable(file('driverPermitPath'), null)).toBe(true)
    expect(isTankerFileApplicable(file('labelPath'), 'TANKER_OIL')).toBe(true)
  })

  it('shows a kind document for that kind only', () => {
    expect(isTankerFileApplicable(file('testingActPath'), 'TANKER_RADIOACTIVE')).toBe(true)
    expect(isTankerFileApplicable(file('testingActPath'), 'TANKER_LPG')).toBe(false)
    expect(isTankerFileApplicable(file('fullCheckPath'), 'TANKER_CRYOGENIC')).toBe(true)
  })
})
