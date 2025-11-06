import { z } from 'zod';

export enum ChecklistAnswerStatus {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  PARTIAL = 'PARTIAL',
}

export const checklistItemSchema = z.object({
  id: z.number(),
  question: z.string(),
  orderNumber: z.number(),
  answer: z.nativeEnum(ChecklistAnswerStatus, {
    required_error: 'Iltimos, javob variantlaridan birini tanlang',
  }),
  description: z.string().optional(),
  file: z.string().optional().nullable(),
});

export const checklistFormSchema = z.object({
  items: z.array(checklistItemSchema),
});

export type ChecklistFormValues = z.infer<typeof checklistFormSchema>;
