import { useState, type MouseEvent, type ReactNode } from 'react'
import { isSameDay, parseISO } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { formatExamTime } from '../lib/exam-time'
import type { AttestationCalendar } from '../model/types'

interface ZoomStartLinkProps {
  exam: Pick<AttestationCalendar, 'start_date' | 'end_date' | 'zoom_start_url'>
  className?: string
  title?: string
  children: ReactNode
}

/**
 * Opens the exam's Zoom meeting, but only on the day it is set for: on any other
 * day it says when the exam is instead of starting it.
 */
export const ZoomStartLink = ({ exam, className, title, children }: ZoomStartLinkProps) => {
  const [isWrongDay, setIsWrongDay] = useState(false)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isSameDay(parseISO(exam.start_date), new Date())) return
    event.preventDefault()
    setIsWrongDay(true)
  }

  return (
    <>
      <a
        href={exam.zoom_start_url ?? undefined}
        target="_blank"
        rel="noreferrer"
        className={className}
        title={title}
        onClick={handleClick}
      >
        {children}
      </a>

      <AlertDialog open={isWrongDay} onOpenChange={setIsWrongDay}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Imtihonni hozir boshlab bo‘lmaydi</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Bu imtihon <b>{formatExamTime(exam)}</b> ga belgilangan. Uni faqat shu kuni boshlash mumkin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Tushunarli</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
