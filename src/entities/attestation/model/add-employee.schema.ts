// src/entities/attestation/model/add-employee.schema.ts
import { z } from 'zod';
import { EmployeeLevel } from './attestation.types';

export const employeeSchema = z.object({
  pin: z.string().min(14, "JSHSHIR 14 ta raqamdan iborat bo'lishi kerak"),
  fullName: z.string().min(1, 'F.I.SH kiritilishi majburiy'),
  level: z.nativeEnum(EmployeeLevel, {
    errorMap: () => ({ message: 'Lavozim turi tanlanishi kerak' }),
  }),
  profession: z.string().min(1, 'Lavozim kiritilishi majburiy'),
  certNumber: z.string().optional(),
  certDate: z.date().optional(),
  certExpiryDate: z.date().optional(),
  ctcTrainingFromDate: z.date().optional(),
  ctcTrainingToDate: z.date().optional(),
  dateOfEmployment: z.string().optional(),
});

export const addEmployeeFormSchema = z.object({
  hfId: z.string().min(1, 'XICHO tanlanishi shart'),
  employeeList: z.array(employeeSchema).min(1, "Kamida bitta xodim qo'shilishi kerak"),
});
