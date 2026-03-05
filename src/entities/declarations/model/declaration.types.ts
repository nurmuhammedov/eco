import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export const createDeclarationSchema = z.object({
  customerTin: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  customerPhoneNumber: z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(9, {
    message: FORM_ERROR_MESSAGES.phone,
  }),
  hfIds: z.array(z.string()).min(1, { message: FORM_ERROR_MESSAGES.required }),
  conclusionId: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  filePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
})

export type CreateDeclarationFormValues = z.infer<typeof createDeclarationSchema>
