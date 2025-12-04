// src/entities/accreditation/models/accreditation.schema.ts

import { AccreditationSphere } from '@/entities/accreditation/models/accreditation.enums'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns.ts'
import { format } from 'date-fns'

const baseAccreditationFilesSchema = {
  accreditationFieldPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  organizationCharterPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  declarationConformityPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  receiptPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  employeesInfoPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  accreditationResourcedPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  responsiblePersonName: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  propertyOwnerShipPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  qualityPerformanceInstructionPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  qualityManagementSystemPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
}

export const AccreditationDtoSchema = z.object({
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, 'Akkreditatsiya sohasini tanlang'),
  accreditationFieldPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  organizationCharterPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  declarationConformityPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  receiptPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  employeesInfoPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  responsiblePersonName: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  accreditationResourcedPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  propertyOwnerShipPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  qualityPerformanceInstructionPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  qualityManagementSystemPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
})

export const ReAccreditationDtoSchema = z.object({
  ...baseAccreditationFilesSchema,
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, 'Akkreditatsiya sohasini tanlang'),
  certificateNumber: z.string().min(1, "Attestat ro'yxat raqamini kiriting"),
  certificateDate: z.date({ required_error: 'Attestat berilgan sanani tanlang' }),
  certificateValidityDate: z.date({ required_error: 'Attestat amal qilish muddatini tanlang' }),
})

export const AccreditationConclusionDtoSchema = z.object({
  phoneNumber: z.string().regex(USER_PATTERNS.phone, { message: FORM_ERROR_MESSAGES.phone }).default(''),
  customerTin: z.string().length(9, FORM_ERROR_MESSAGES.required).default(''),
  customerLegalName: z.string().min(1, FORM_ERROR_MESSAGES.required),
  customerLegalForm: z.string().min(1, FORM_ERROR_MESSAGES.required),
  customerLegalAddress: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  customerPhoneNumber: z.string().regex(USER_PATTERNS.phone, { message: FORM_ERROR_MESSAGES.phone }),
  customerFullName: z.string().min(1, FORM_ERROR_MESSAGES.required),
  submissionDate: z
    .date({ required_error: FORM_ERROR_MESSAGES.required })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  monitoringLetterDate: z
    .date({ required_error: FORM_ERROR_MESSAGES.required })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  monitoringLetterNumber: z.string().min(1, FORM_ERROR_MESSAGES.required),
  objectName: z.string().min(1, FORM_ERROR_MESSAGES.required),
  firstSymbolsGroup: z.string().min(1, FORM_ERROR_MESSAGES.required),
  secondSymbolsGroup: z.string().min(1, FORM_ERROR_MESSAGES.required),
  thirdSymbolsGroup: z.string().min(1, FORM_ERROR_MESSAGES.required),
  regionId: z.string().min(1, FORM_ERROR_MESSAGES.required).default(''),
  districtId: z.string().min(1, FORM_ERROR_MESSAGES.required).default(''),
  address: z.string().min(1, FORM_ERROR_MESSAGES.required),
  expertiseConclusionPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  expertiseConclusionNumber: z.string().min(1, FORM_ERROR_MESSAGES.required),
})

export const ExpandAccreditationDtoSchema = z.object({
  ...baseAccreditationFilesSchema,
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, 'Akkreditatsiya sohasini tanlang'),
  certificateNumber: z.string().min(1, "Attestat ro'yxat raqamini kiriting"),
  certificateDate: z.date({ required_error: 'Attestat berilgan sanani tanlang' }),
  certificateValidityDate: z.date({ required_error: 'Attestat amal qilish muddatini tanlang' }),
})
