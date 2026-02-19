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
import { useAdd } from '@/shared/hooks/api'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  changeId: string
  title: string
  buttonText: string
}

const ConfirmProcessModal: React.FC<Props> = ({ changeId, title, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: confirmChange, isPending } = useAdd(`/changes/${changeId}/confirm`)

  const handleConfirm = () => {
    confirmChange(
      {},
      {
        onSuccess: () => {
          setIsOpen(false)
          queryClient.invalidateQueries({ queryKey: ['/changes/by-belong'] })
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="success">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-sm">Haqiqatan ham ushbu so‘rovni tasdiqlaysizmi?</p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Yo‘q
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={handleConfirm}>
            Ha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmProcessModal
