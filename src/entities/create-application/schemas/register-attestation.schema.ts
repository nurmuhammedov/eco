import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

const employeeSchema = z.object({
  pin: z.string().length(14, FORM_ERROR_MESSAGES.pin),
  fullName: z.string().min(1, 'F.I.SH. kiritilishi majburiy'),
  profession: z.string().min(1, 'Lavozim kiritilishi majburiy'),
  level: z.enum(['LEADER', 'TECHNICIAN', 'EMPLOYEE']),
  certNumber: z.string().optional(),
  certDate: z
    .date()
    .transform((val) => format(val, 'yyyy-MM-dd'))
    .optional(),
  certExpiryDate: z
    .date()
    .transform((val) => format(val, 'yyyy-MM-dd'))
    .optional(),
  ctcTrainingFromDate: z
    .date()
    .transform((val) => format(val, 'yyyy-MM-dd'))
    .optional(),
  ctcTrainingDate: z
    .date()
    .transform((val) => format(val, 'yyyy-MM-dd'))
    .optional(),
  dateOfEmployment: z
    .date()
    .transform((val) => format(val, 'yyyy-MM-dd'))
    .optional(),
});

export const AttestationAppealDtoSchema = z.object({
  hfRegistryNumber: z.string().min(1, 'Hisobga olish raqami kiritilishi majburiy'),
  upperOrganizationName: z.string().min(1, 'Yuqori turuvchi tashkilot nomi kiritilishi majburiy'),
  legalName: z.string().min(1, 'Foydalanuvchi tashkilot nomi kiritilishi majburiy'),
  tin: z.string().length(9, FORM_ERROR_MESSAGES.required),
  hfName: z.string().min(1, 'XICHO nomi kiritilishi majburiy'),
  hfAddress: z.string().min(1, 'XICHO manzili kiritilishi majburiy'),
  regionId: z.string().min(1, 'Viloyat tanlanishi majburiy'),
  districtId: z.string().min(1, 'Tuman tanlanishi majburiy'),
  direction: z.enum(['COMMITTEE', 'REGIONAL']),
  employeeList: z.array(employeeSchema).min(1, 'Kamida bitta xodim kiritilishi shart'),
  phoneNumber: z.string().refine((val) => USER_PATTERNS.phone.test(val), {
    message: FORM_ERROR_MESSAGES.phone,
  }),
});

export type CreateAttestationDTO = z.infer<typeof AttestationAppealDtoSchema>;
