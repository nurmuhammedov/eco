import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

/** A plain or scientific number, e.g. 2680000000 or 2.40E+11; a comma may stand for the point */
const ACTIVITY_PATTERN = /^\d+([.,]\d+)?([eE][+-]?\d+)?$/

/**
 * An ionizing radiation source's activity in becquerels, kept as the text that
 * was typed. The backend stores a string and the old system's records read like
 * 2.40E+11, while the number input took no exponent and the form sent a number,
 * so every new value came out spelled in full (2680000000).
 */
export const irsActivitySchema = z
  .string({ required_error: FORM_ERROR_MESSAGES.required })
  .trim()
  .min(1, FORM_ERROR_MESSAGES.required)
  .regex(ACTIVITY_PATTERN, FORM_ERROR_MESSAGES.invalid)
  // The local decimal comma becomes a point, so the value still reads as a number wherever it is parsed
  .transform((value) => value.replace(',', '.'))
  .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, FORM_ERROR_MESSAGES.invalid)
