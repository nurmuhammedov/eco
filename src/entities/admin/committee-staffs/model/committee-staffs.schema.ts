import { z } from 'zod'
import { UserRoles } from '@/shared/types/user'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'

/** What both staff forms ask for; the birth date only finds the person's name in the state registry */
export const staffFields = {
  pin: z.string().trim().regex(USER_PATTERNS.pin),
  birthDate: z.date().optional().nullable(),
  fullName: z
    .string()
    .trim()
    .min(1)
    .transform((name) => name.replace(/\s+/g, ' ')),
  position: z.string().trim().min(1),
  role: z.nativeEnum(UserRoles),
  directions: z.array(z.string()).min(1),
  phoneNumber: z.string().trim().regex(USER_PATTERNS.phone),
}

export const committeeStaffSchema = z.object({
  ...staffFields,
  departmentId: z.string().min(1),
})

export type CommitteeStaffFormValues = z.input<typeof committeeStaffSchema>
