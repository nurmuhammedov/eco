import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export const checkExpiryDate = (data: any, ctx: z.RefinementCtx, pathField: string, dateField: string) => {
  const pathValue = data[pathField]
  const dateValue = data[dateField]

  if (pathValue && typeof pathValue === 'string' && pathValue.trim() !== '') {
    if (!dateValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FORM_ERROR_MESSAGES.required,
        path: [dateField],
      })
    }
  }
}
