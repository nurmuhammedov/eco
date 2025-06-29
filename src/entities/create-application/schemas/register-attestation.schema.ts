import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

const employeeSchema = z.object({
  pin: z.string().length(14, FORM_ERROR_MESSAGES.pin),
  fullName: z.string().min(1, 'F.I.SH. kiritilishi majburiy'),
  profession: z.string().min(1, 'Lavozim kiritilishi majburiy'),
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
});

export const AttestationAppealFormSchema = z.object({
  hfId: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  hfRegistryNumber: z.string().min(1, 'Hisobga olish raqami kiritilishi majburiy'),
  upperOrganizationName: z.string().transform((val) => (val ? val : '')),
  legalName: z.string().transform((val) => (val ? val : '')),
  legalTin: z.string().length(9, FORM_ERROR_MESSAGES.required),
  hfName: z.string().min(1, 'XICHO nomi kiritilishi majburiy'),
  address: z.string().min(1, 'XICHO manzili kiritilishi majburiy'),
  regionId: z.string().min(1, 'Viloyat tanlanishi majburiy'),
  districtId: z.string().min(1, 'Tuman tanlanishi majburiy'),
  direction: z.enum(['COMMITTEE', 'REGIONAL']),
  dateOfAttestation: z
    .date({
      invalid_type_error: "Iltimos, to'g'ri sana va vaqt kiriting",
    })
    .optional()
    .nullable()
    .superRefine((data: any, ctx) => {
      if (data?.direction === 'REGIONAL' && !data.dateOfAttestation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Iltimos, to'g'ri sana va vaqt kiriting",
          path: ['dateOfAttestation'],
        });
      }
    }),
  employeeList: z.array(employeeSchema).min(1, 'Kamida bitta xodim kiritilishi shart'),
  phoneNumber: z.string().refine((val) => USER_PATTERNS.phone.test(val), {
    message: FORM_ERROR_MESSAGES.phone,
  }),
});

export const AttestationAppealDtoSchema = AttestationAppealFormSchema.transform((data) => {
  return {
    ...data,
    dateOfAttestation:
      data.direction === 'REGIONAL' && data.dateOfAttestation
        ? format(data.dateOfAttestation, "yyyy-MM-dd'T'HH:mm")
        : null,
  };
});

export type CreateAttestationDTO = z.infer<typeof AttestationAppealDtoSchema>;
