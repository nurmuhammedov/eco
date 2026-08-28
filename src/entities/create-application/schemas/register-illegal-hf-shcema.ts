import { format } from 'date-fns'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { HfHazardousSign, HfLegalType } from '@/shared/constants/hf-attributes'
import { HFSphereEnum, HF_CATEGORY_MODES, checkCategoryMode } from './register-hf.schema'
import { hfAppealFilesSchema, hfAppealFilesUpdateSchema } from './hf-appeal-files'

const { required, invalid } = FORM_ERROR_MESSAGES

const optionalText = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null))

const baseShape = {
  identity: z
    .string({ required_error: required })
    .length(9, 'STIR 9 ta raqamdan iborat bo‘lishi kerak')
    .regex(/^\d+$/, 'Faqat raqamlar kiritilishi kerak'),
  phoneNumber: z
    .string({ required_error: required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  upperOrganization: optionalText(),
  name: z.string({ required_error: required }).trim().min(1, required).max(250, invalid),
  categoryMode: z.enum(HF_CATEGORY_MODES, { required_error: required }),
  categoryId: z.string().optional(),
  multiCategoryIds: z.array(z.union([z.string(), z.number()])).default([]),
  hfTypeId: z.string({ required_error: required }).min(1, required),
  spheres: z.array(HFSphereEnum, { required_error: required }).min(1, required),
  regionId: z.string({ required_error: required }).min(1, required),
  districtId: z.string({ required_error: required }).min(1, required),
  address: z.string({ required_error: required }).trim().min(1, required),
  location: z.string({ required_error: required }).min(1, required),
  extraArea: z.string({ required_error: required }).trim().min(1, required),
  hazardousSubstance: z.string({ required_error: required }).trim().min(1, required),
  hazardousSign: z.nativeEnum(HfHazardousSign, { required_error: required }),
  legalType: z.nativeEnum(HfLegalType, { required_error: required }),
  cadastreNumber: z.string({ required_error: required }).trim().min(1, required).max(50, invalid),
  // LocalDate on the server: an ISO datetime would not parse.
  startedDate: z.date({ required_error: required }).transform((date) => format(date, 'yyyy-MM-dd')),
  managerCount: optionalText(),
  engineerCount: optionalText(),
  workerCount: optionalText(),
}

export const RegisterIllegalHfBaseSchema = z.object({
  ...baseShape,
  /** One attachment set per chosen category, keyed by its id. */
  hfAppealFilesDto: z.record(z.string(), hfAppealFilesSchema),
})

/**
 * Editing an already registered facility does not ask again for the
 * identification card or the fee receipt, which the registration already holds.
 * The four attributes added later are optional here too: records predating them
 * would otherwise be uneditable until every one was filled in.
 */
export const UpdateIllegalHfBaseSchema = z.object({
  ...baseShape,
  hazardousSign: z.nativeEnum(HfHazardousSign).optional().nullable(),
  legalType: z.nativeEnum(HfLegalType).optional().nullable(),
  cadastreNumber: z.string().trim().max(50, invalid).optional().nullable(),
  startedDate: z
    .date()
    .optional()
    .nullable()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  hfAppealFilesDto: z.record(z.string(), hfAppealFilesUpdateSchema),
})

export type RegisterIllegalHfDTO = z.infer<typeof RegisterIllegalHfSchema>

export const RegisterIllegalHfSchema = RegisterIllegalHfBaseSchema.superRefine(checkCategoryMode)
