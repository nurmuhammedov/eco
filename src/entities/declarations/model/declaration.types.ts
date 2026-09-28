import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export type DeclarationStatus = 'IN_PROCESS' | 'CANCELED' | 'REJECTED' | 'COMPLETED'

const declarationFields = {
  hfIds: z.array(z.string()).min(1, { message: FORM_ERROR_MESSAGES.required }),
  conclusionId: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  declarationPath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  infoLetterPath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  explanatoryNotePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
}

/** An accredited expert files for a customer found by their TIN */
export const expertDeclarationSchema = z.object({
  ...declarationFields,
  customerTin: z.string({ required_error: FORM_ERROR_MESSAGES.required }).length(9),
})

/** An organisation files its own declaration, naming the expert who prepared it if any */
export const legalDeclarationSchema = z.object({
  ...declarationFields,
  expertId: z.number().optional(),
})

export type ExpertDeclarationFormValues = z.infer<typeof expertDeclarationSchema>
export type LegalDeclarationFormValues = z.infer<typeof legalDeclarationSchema>

/** DeclarationByExpertDto (`/declarations/by-expert`) */
export type ExpertDeclarationPayload = Omit<ExpertDeclarationFormValues, 'customerTin'> & { customerTin: number }

/** DeclarationByLegalDto (`/declarations/by-legal`) */
export type LegalDeclarationPayload = LegalDeclarationFormValues

/** DeclarationRes (`GET /declarations`) */
export interface DeclarationRow {
  id: string
  registryNumber: string | null
  createdAt: string | null
  hfRegistryNumbers: string[] | null
  expertName: string | null
  expertTin: number | null
  customerName: string | null
  customerTin: number | null
  conclusionRegistryNumber: string | null
  declarationPath: string | null
  infoLetterPath: string | null
  explanatoryNotePath: string | null
  status: DeclarationStatus | null
  description: string | null
  createdBy: string | null
  registryFilePath: string | null
}

/** DeclarationResById (`GET /declarations/{id}`) */
export interface DeclarationDetail {
  id: string
  registryNumber: string | null
  createdAt: string | null
  expertName: string | null
  expertTin: number | null
  expertId: number | null
  customerName: string | null
  customerTin: number | null
  conclusionId: string | null
  conclusionRegistryNumber: string | null
  hfIds: string[] | null
  declarationPath: string | null
  infoLetterPath: string | null
  explanatoryNotePath: string | null
  status: DeclarationStatus | null
  registryFilePath: string | null
  createdBy: string | null
  description: string | null
}
