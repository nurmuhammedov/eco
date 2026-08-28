import { format } from 'date-fns'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { HFSphere } from '@/shared/types'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { HfHazardousSign, HfLegalType } from '@/shared/constants/hf-attributes'
import { hfAppealFilesSchema } from './hf-appeal-files'

export const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]])

export const HF_CATEGORY_MODES = ['SINGLE', 'MULTI'] as const

const { required, invalid } = FORM_ERROR_MESSAGES

const __HFAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ required_error: required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  address: z.string({ required_error: required }).trim().min(1, required),
  location: z.string({ required_error: required }).min(1, required),
  categoryMode: z.enum(HF_CATEGORY_MODES, { required_error: required }),
  categoryId: z.string().optional(),
  multiCategoryIds: z.array(z.union([z.string(), z.number()])).default([]),
  /**
   * One attachment set per chosen category, keyed by its id. The server takes
   * this shape whether the facility declares one sector or several.
   */
  hfAppealFilesDto: z.record(z.string(), hfAppealFilesSchema),
  hfTypeId: z.string({ required_error: required }).min(1, required),
  regionId: z.string({ required_error: required }).min(1, required),
  districtId: z.string({ required_error: required }).min(1, required),
  upperOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  name: z.string({ required_error: required }).trim().min(1, required).max(250, invalid),
  extraArea: z.string({ required_error: required }).trim().min(1, required),
  hazardousSubstance: z.string({ required_error: required }).trim().min(1, required),
  hazardousSign: z.nativeEnum(HfHazardousSign, { required_error: required }),
  legalType: z.nativeEnum(HfLegalType, { required_error: required }),
  cadastreNumber: z.string({ required_error: required }).trim().min(1, required).max(50, invalid),
  // LocalDate on the server: an ISO datetime would not parse.
  startedDate: z.date({ required_error: required }).transform((date) => format(date, 'yyyy-MM-dd')),
  spheres: z.array(HFSphereEnum, { required_error: required }).min(1, required),
})

/**
 * A facility is either single-sector or multi-sector, and each mode validates a
 * different field. Multi-sector means at least two - one category would be the
 * single-sector case wearing the wrong label.
 */
export const checkCategoryMode = (data: any, ctx: z.RefinementCtx) => {
  if (data.categoryMode === 'MULTI') {
    if (!data.multiCategoryIds || data.multiCategoryIds.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kamida ikkita toifa tanlanishi kerak',
        path: ['multiCategoryIds'],
      })
    }
    return
  }

  if (!data.categoryId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: ['categoryId'] })
  }
}

export const HFAppealDtoSchema = __HFAppealDtoSchema.superRefine(checkCategoryMode)
