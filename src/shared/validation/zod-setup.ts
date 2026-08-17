import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from './error-messages'

const errorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type && (issue.received === 'undefined' || issue.received === 'null')) {
    return { message: FORM_ERROR_MESSAGES.required }
  }

  if (issue.code === z.ZodIssueCode.invalid_enum_value || issue.code === z.ZodIssueCode.invalid_literal) {
    return { message: FORM_ERROR_MESSAGES.required }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(errorMap)
