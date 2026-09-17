import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const RegisterIllegalEscalatorBaseSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  identity: z.string().min(1),
  birthDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),

  hazardousFacilityId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
  childEquipmentId: z.string().trim().min(1),
  factoryNumber: z.string().trim().min(1),
  regionId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  parkId: z.union([z.number(), z.string()]).nullable().optional(),
  address: z.string().trim().min(1),
  model: z.string().trim().min(1),
  factory: z.string().trim().min(1),
  location: z.string().trim().min(1),
  manufacturedAt: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  partialCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  passengersPerMinute: z.string().trim().min(1),
  length: z.string().trim().min(1),
  speed: z.string().trim().min(1),
  height: z.string().trim().min(1),

  labelPath: z.string().trim().min(1),
  assignmentDecreePath: z.string().trim().min(1),
  saleContractPath: z.string().trim().min(1),
  equipmentCertPath: z.string().trim().min(1),
  installationCertPath: z.string().trim().min(1),
  passportPath: z.string().trim().min(1),
  expertisePath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  expertiseExpiryDate: z
    .date()
    .nullable()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  fullCheckPath: z.string().trim().min(1),
  nextFullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
})

export const escalatorRefinement = (data: any, ctx: z.RefinementCtx) => {
  if (data.identity && data.identity.length === 14) {
    if (!data.birthDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FORM_ERROR_MESSAGES.required,
        path: ['birthDate'],
      })
    }
  }
}

const __RegisterIllegalEscalatorSchema = RegisterIllegalEscalatorBaseSchema.superRefine(escalatorRefinement)

export type RegisterIllegalEscalatorDTO = z.infer<typeof RegisterIllegalEscalatorSchema>

export const RegisterIllegalEscalatorSchema = __RegisterIllegalEscalatorSchema.superRefine((data: any, ctx: any) =>
  checkExpiryDate(data, ctx, 'expertisePath', 'expertiseExpiryDate')
)
