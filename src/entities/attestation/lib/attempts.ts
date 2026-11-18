import { addBusinessDays, isBefore, isSameDay, startOfDay } from 'date-fns'
import type { AttestationApplication } from '../model/types'

/** Item 27: the organization learns the place and time at least this many working days ahead */
export const NOTICE_WORKING_DAYS = 15

/**
 * The first day an exam set today may take place. Weekends are skipped, as
 * the services API counts them; public holidays are known to neither side.
 */
export const earliestExamDate = (today: Date = new Date()) => addBusinessDays(startOfDay(today), NOTICE_WORKING_DAYS)

/**
 * A day the exam may be put on. An exam set before the rule may keep the day
 * it already has; it just cannot be moved closer.
 */
export const isAllowedExamDate = (date: Date, today: Date = new Date(), currentDate?: Date | null) =>
  !isBefore(startOfDay(date), earliestExamDate(today)) || (!!currentDate && isSameDay(date, currentDate))

/** A repeat after a failure (items 43–44) */
export const isRepeatAttempt = (application: Pick<AttestationApplication, 'attempt'>) => (application.attempt ?? 1) > 1

/**
 * Item 44: a second failure in a row; the commission sends the organization a
 * submission (taqdimnoma) once the exam's protocol is formed.
 */
export const hasPresentation = (
  application: Pick<AttestationApplication, 'status' | 'attempt' | 'calendar'>,
  protocolNumber?: number | null
) =>
  application.status === 'FAILED' &&
  (application.attempt ?? 1) >= 2 &&
  !!(protocolNumber ?? application.calendar?.protocol_number)
