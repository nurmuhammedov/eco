import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from './error-messages'

const { required, invalid } = FORM_ERROR_MESSAGES

/**
 * Every field error in the interface is one of two sentences, so the schemas
 * themselves carry no messages: a rule added later is worded correctly whether
 * or not its author remembered the convention. An explicit message is still
 * honoured, which is how the few business limits that have to name a number
 * ("at most 100 per slot") survive.
 */
const errorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: issue.received === 'undefined' || issue.received === 'null' ? required : invalid }

    case z.ZodIssueCode.invalid_enum_value:
    case z.ZodIssueCode.invalid_literal:
    case z.ZodIssueCode.invalid_union_discriminator:
      return { message: required }

    // A minimum of one is the way an empty string or an empty list is rejected,
    // which the reader experiences as a field they have not filled in yet.
    case z.ZodIssueCode.too_small:
      return {
        message: issue.type !== 'number' && issue.type !== 'date' && Number(issue.minimum) <= 1 ? required : invalid,
      }

    case z.ZodIssueCode.too_big:
    case z.ZodIssueCode.invalid_string:
    case z.ZodIssueCode.invalid_date:
    case z.ZodIssueCode.not_multiple_of:
    case z.ZodIssueCode.not_finite:
    case z.ZodIssueCode.custom:
      return { message: invalid }

    default:
      return { message: ctx.defaultError }
  }
}

z.setErrorMap(errorMap)
