import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

/** The owner as a registration form takes it: a taxpayer or citizen number, and a citizen's birth date */
interface OwnerFields {
  identity?: string | null
  birthDate?: string | Date | null
}

/** A citizen owner (a 14-digit number) is looked up by the birth date as well */
export const requireCitizenBirthDate = (data: OwnerFields, ctx: z.RefinementCtx) => {
  if (data.identity?.length === 14 && !data.birthDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: ['birthDate'] })
  }
}
