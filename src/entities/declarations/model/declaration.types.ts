import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export enum AccreditationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED', // Muddati o'tgan
  EXPIRING_SOON = 'EXPIRING_SOON', // Muddati yaqinlashayotganlar
  STOPPED = 'STOPPED', // Qo'mita tomonidan to‘xtatib qo'yilgan
  NOT_PERMITTED = 'NOT_PERMITTED', // Ruxsat berilmgan tashkilot (Ekspert tashkiloatlaridan boshqa hamma legallar)
}

export const createDeclarationSchema = z.object({
  customerTin: z.string({ required_error: FORM_ERROR_MESSAGES.required }).optional(),
  expertId: z.number({ required_error: FORM_ERROR_MESSAGES.required }).optional(),
  hfIds: z.array(z.string()).min(1, { message: FORM_ERROR_MESSAGES.required }),
  conclusionId: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  declarationPath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  infoLetterPath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  explanatoryNotePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
})

export type CreateDeclarationFormValues = z.infer<typeof createDeclarationSchema>
