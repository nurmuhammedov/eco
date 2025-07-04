// src/entities/accreditation/models/accreditation.schema.ts

import { AccreditationSphere } from '@/entities/accreditation/models/accreditation.enums';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

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
};

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
});

export const ReAccreditationDtoSchema = z.object({
  ...baseAccreditationFilesSchema,
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, 'Akkreditatsiya sohasini tanlang'),
  certificateNumber: z.string().min(1, "Attestat ro'yxat raqamini kiriting"),
  certificateIssueDate: z.date({ required_error: 'Attestat berilgan sanani tanlang' }),
  certificateEndDate: z.date({ required_error: 'Attestat amal qilish muddatini tanlang' }),
});

export const ExpandAccreditationDtoSchema = z.object({
  ...baseAccreditationFilesSchema,
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, 'Akkreditatsiya sohasini tanlang'),
  certificateNumber: z.string().min(1, "Attestat ro'yxat raqamini kiriting"),
  certificateIssueDate: z.date({ required_error: 'Attestat berilgan sanani tanlang' }),
});
