import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';
import { AccreditationSphere } from './accreditation.enums';

export const AccreditationDtoSchema = z.object({
  accreditationSpheres: z.array(z.nativeEnum(AccreditationSphere)).min(1, 'Akkreditatsiya sohasini tanlang'),
  accreditationFieldPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  organizationCharterPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  declarationConformityPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  receiptPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  employeesInfoPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  accreditationResourcedPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  propertyOwnerShipPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  qualityPerformanceInstructionPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  qualityManagementSystemPath: z.string().min(1, FORM_ERROR_MESSAGES.required),
});

export type CreateAccreditationDTO = z.infer<typeof AccreditationDtoSchema>;
