import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

const employeeSchema = z.object({
  pin: z.string().length(14, FORM_ERROR_MESSAGES.invalid),
  fullName: z.string().min(1),
  profession: z.string().min(1),
  level: z.enum(['LEADER', 'TECHNICIAN', 'EMPLOYEE']),
  certNumber: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  certDate: z.date().transform((val) => format(val, 'yyyy-MM-dd')),
  certExpiryDate: z.date().transform((val) => format(val, 'yyyy-MM-dd')),
  ctcTrainingFromDate: z.date().transform((val) => format(val, 'yyyy-MM-dd')),
  ctcTrainingToDate: z.date().transform((val) => format(val, 'yyyy-MM-dd')),
  dateOfEmployment: z
    .date()
    .transform((val) => format(val, 'yyyy-MM-dd'))
    .optional(),
})

export const AttestationAppealFormSchema = z.object({
  hfId: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  hfRegistryNumber: z.string().min(1),
  upperOrganizationName: z.string().transform((val) => (val ? val : '')),
  legalName: z.string().transform((val) => (val ? val : '')),
  legalTin: z.string().length(9, FORM_ERROR_MESSAGES.required),
  hfName: z.string().min(1).max(250),
  address: z.string().min(1),
  regionId: z.string().min(1),
  districtId: z.string().min(1),
  direction: z.enum(['COMMITTEE', 'REGIONAL']),
  dateOfAttestation: z
    .date()
    .optional()
    .nullable()
    .superRefine((data: any, ctx) => {
      if (data?.direction === 'REGIONAL' && !data.dateOfAttestation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: FORM_ERROR_MESSAGES.invalid,
          path: ['dateOfAttestation'],
        })
      }
    }),
  employeeList: z.array(employeeSchema).min(1),
  phoneNumber: z.string().refine((val) => USER_PATTERNS.phone.test(val), {
    message: FORM_ERROR_MESSAGES.invalid,
  }),
})

const __AttestationAppealDtoSchema = AttestationAppealFormSchema.transform((data) => {
  return {
    ...data,
    dateOfAttestation:
      data.direction === 'REGIONAL' && data.dateOfAttestation
        ? format(data.dateOfAttestation, "yyyy-MM-dd'T'HH:mm")
        : null,
  }
})

export type CreateAttestationDTO = z.infer<typeof AttestationAppealDtoSchema>

export const AttestationAppealDtoSchema = __AttestationAppealDtoSchema
