import { format, parseISO } from 'date-fns'
import type { AttestationCalendar } from '../model/types'

type ExamTime = Pick<AttestationCalendar, 'start_date' | 'end_date'>

export const formatExamDate = (exam: ExamTime) => format(parseISO(exam.start_date), 'dd.MM.yyyy')

export const formatExamHours = (exam: ExamTime) =>
  `${format(parseISO(exam.start_date), 'HH:mm')}–${format(parseISO(exam.end_date), 'HH:mm')}`

export const formatExamTime = (exam: ExamTime) => `${formatExamDate(exam)} · ${formatExamHours(exam)}`
