import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const RegisterIllegalContainerBaseSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  identity: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  birthDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),

  hazardousFacilityId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
  childEquipmentId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  factoryNumber: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  model: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  factory: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  location: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  manufacturedAt: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  partialCheckDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  nonDestructiveCheckDate: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  capacity: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  environment: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  pressure: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),

  labelPath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  assignmentDecreePath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  saleContractPath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  expertisePath: z.string().optional(),
  expertiseExpiryDate: z
    .date()
    .nullable()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  equipmentCertPath: z.string().optional(),
  installationCertPath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  additionalFilePath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  partialCheckPath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  nextPartialCheckDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckPath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  nextFullCheckDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
})

export const containerRefinement = (data: any, ctx: z.RefinementCtx) => {
  if (data.identity && data.identity.length === 14) {
    if (!data.birthDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Majburiy maydon!',
        path: ['birthDate'],
      })
    }
  }
}

export const RegisterIllegalContainerSchema = RegisterIllegalContainerBaseSchema.superRefine(containerRefinement)

export type RegisterIllegalContainerDTO = z.infer<typeof RegisterIllegalContainerSchema>
