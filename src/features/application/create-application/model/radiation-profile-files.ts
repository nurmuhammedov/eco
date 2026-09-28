import type { FieldValues, SetValueConfig, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import type { FileDto } from '@/shared/types'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

/**
 * The organisation's radiation profile holds the files every IRS and X-ray
 * application carries. An organisation without one gives them on the form.
 */
export const requireProfileFiles = <S extends z.ZodTypeAny>(
  schema: S,
  fields: readonly (keyof z.input<S> & string)[]
) =>
  schema.superRefine((data: Record<string, unknown>, ctx) => {
    for (const field of fields) {
      if (!data[field])
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: [field] })
    }
  })

/** A profile file missing its document or its expiry date holds the application back */
export const hasIncompleteFiles = (files?: Record<string, FileDto> | null) =>
  !!files && Object.values(files).some((file) => !file?.path || !file?.expiryDate)

/** Puts the profile's files on the form: each `fileNPath`, with its date as `fileNExpiryDate` */
export const fillFromProfile = <T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  files: Record<string, FileDto>
) => {
  // The profile may hold files the form has no field for; they are sent all the same
  const set = setValue as unknown as (name: string, value: string | Date, options: SetValueConfig) => void

  for (const [key, file] of Object.entries(files)) {
    if (file?.path) set(key, file.path, { shouldValidate: true })
    if (file?.expiryDate) set(key.replace('Path', 'ExpiryDate'), new Date(file.expiryDate), { shouldValidate: true })
  }
}

/** The schema drops the profile files it has no field for, so they are laid back under what it validated */
export const withProfileFiles = <T extends object>(formValues: object, validated: T): T => ({
  ...formValues,
  ...validated,
})
