import { z } from 'zod'

export enum ChecklistAnswerStatus {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  UNRELATED = 'UNRELATED',
}

export const checklistItemSchema = z
  .object({
    id: z.number(),
    question: z.string(),
    orderNumber: z.number(),
    answer: z.nativeEnum(ChecklistAnswerStatus, {
      required_error: 'Iltimos, javob variantlaridan birini tanlang',
    }),
    description: z.string().optional().nullable(),
    deadline: z.date().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.answer === ChecklistAnswerStatus.NEGATIVE) {
        return data.description
      }
      return true
    },
    {
      message: 'Majburiy maydon!',
      path: ['description'],
    }
  )
  .refine(
    (data) => {
      if (data.answer === ChecklistAnswerStatus.NEGATIVE) {
        return data.deadline
      }
      return true
    },
    {
      message: 'Majburiy maydon!',
      path: ['deadline'],
    }
  )

export const checklistFormSchema = z.object({
  items: z.array(checklistItemSchema),
})

export type ChecklistFormValues = z.infer<typeof checklistFormSchema>
