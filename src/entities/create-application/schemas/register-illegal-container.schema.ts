import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const RegisterIllegalContainerBaseSchema = z.object({
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
  address: z.string().trim().min(1),
  model: z.string().trim().min(1),
  factory: z.string().trim().min(1),
  location: z.string().trim().min(1),
  manufacturedAt: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  partialCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  nonDestructiveCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  capacity: z.string().trim().min(1),
  environment: z.string().trim().min(1),
  pressure: z.string().trim().min(1),

  usageRightsPath: z.string().trim().optional(),
  labelPath: z.string().trim().min(1),
  assignmentDecreePath: z.string().trim().min(1),
  saleContractPath: z.string().trim().min(1),
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
  equipmentCertPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  installationCertPath: z.string().trim().min(1),
  passportPath: z.string().trim().min(1),
  partialCheckPath: z.string().trim().min(1),
  nextPartialCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckPath: z.string().trim().min(1),
  nextFullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
})

export const containerRefinement = (data: any, ctx: z.RefinementCtx) => {
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

const __RegisterIllegalContainerSchema = RegisterIllegalContainerBaseSchema.superRefine(containerRefinement)

export type RegisterIllegalContainerDTO = z.infer<typeof RegisterIllegalContainerSchema>

export const RegisterIllegalContainerSchema = __RegisterIllegalContainerSchema.superRefine((data: any, ctx: any) =>
  checkExpiryDate(data, ctx, 'expertisePath', 'expertiseExpiryDate')
)
