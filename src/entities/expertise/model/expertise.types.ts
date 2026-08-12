import { z } from 'zod'
import { addExpertiseSchema, addOldExpertiseSchema } from './expertise.schema'

export interface LegalInfo {
  legalName: string
  fullName: string
  legalAddress: string
  phoneNumber: string
}

export interface HfoSelectOption {
  id: string
  name: string
  registryNumber: string
  address: string
  regionId: string
  districtId: string
}

export type AddExpertiseFormValues = z.infer<typeof addExpertiseSchema>
export type AddOldExpertiseFormValues = z.infer<typeof addOldExpertiseSchema>
