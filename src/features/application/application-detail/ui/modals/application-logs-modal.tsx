import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import React, { useState } from 'react'
import { ApplicationLogsList } from '@/features/application/application-logs'

const ApplicationLogsModal = ({
  id,
  type = 'appeal',
  trigger,
}: {
  id?: string
  type?: 'appeal' | 'change'
  trigger?: React.ReactNode
}) => {
  const [isShow, setIsShow] = useState(false)

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>{trigger ? trigger : <Button type="button">Amaliyotlar tarixi</Button>}</DialogTrigger>
        <DialogContent hideCloseIcon className="max-h-[95vh] overflow-y-auto sm:max-w-[1124px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Amaliyotlar tarixi</DialogTitle>
          </DialogHeader>
          <ApplicationLogsList id={id} type={type} isShow={isShow} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Yopish</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ApplicationLogsModal
