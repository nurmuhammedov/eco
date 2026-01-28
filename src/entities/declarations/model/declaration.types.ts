import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export enum DeclarationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface Declaration {
  id: string
  registryNumber: string
  createdAt: string
  hfRegistryNumber: string
  hfName: string
  address: string
  legalName: string
  legalTin: string
  customerName: string
  customerTin: string
  conclusionRegistryNumber: string
  processStatus: DeclarationStatus
  filePath?: string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
}

export const createDeclarationSchema = z.object({
  customerTin: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  customerPhoneNumber: z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(9, {
    message: FORM_ERROR_MESSAGES.phone,
  }),
  hfId: z.string().optional(),
  hfName: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  hfRegistryNumber: z.string().optional(),
  regionId: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  districtId: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  address: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  conclusionId: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  filePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
})

export type CreateDeclarationFormValues = z.infer<typeof createDeclarationSchema>
