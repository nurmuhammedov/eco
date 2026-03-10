import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/button'
import useAdd from '@/shared/hooks/api/useAdd'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'

interface DeclarationActionsProps {
  id: string
  status: string
}

export const DeclarationActions = ({ id, status }: DeclarationActionsProps) => {
  const queryClient = useQueryClient()

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [description, setDescription] = useState('')

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['declarations'] })
    queryClient.invalidateQueries({ queryKey: ['/declarations', id] })
  }

  const {
    mutate: confirm,
    isPending: isConfirming,
    isSuccess: isConfirmSuccess,
  } = useAdd<any, any, any>(`/declarations/${id}/confirm`, 'Deklaratsiya tasdiqlandi!')

  const {
    mutate: reject,
    isPending: isRejecting,
    isSuccess: isRejectSuccess,
  } = useAdd<{ description: string }, any, any>(`/declarations/${id}/reject`, 'Deklaratsiya rad etildi!')

  const {
    mutate: cancel,
    isPending: isCanceling,
    isSuccess: isCancelSuccess,
  } = useAdd<{ description: string }, any, any>(`/declarations/${id}/cancel`, 'Deklaratsiya qaytarildi!')

  useEffect(() => {
    if (isConfirmSuccess || isRejectSuccess || isCancelSuccess) {
      setIsConfirmModalOpen(false)
      setIsRejectModalOpen(false)
      setIsCancelModalOpen(false)
      setDescription('')
      invalidate()
    }
  }, [isConfirmSuccess, isRejectSuccess, isCancelSuccess])

  if (status !== 'IN_PROCESS') return null

  return (
    <div className="flex gap-2">
      <Button variant="success" onClick={() => setIsConfirmModalOpen(true)} disabled={isConfirming}>
        Tasdiqlash
      </Button>
      <Button variant="destructive" onClick={() => setIsRejectModalOpen(true)}>
        Rad etish
      </Button>
      <Button variant="destructiveOutline" onClick={() => setIsCancelModalOpen(true)}>
        Qaytarib yuborish
      </Button>

      {/* Confirm Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tasdiqlash</DialogTitle>
            <DialogDescription>Ushbu deklaratsiyani tasdiqlamoqchimisiz?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="success" onClick={() => confirm({})} disabled={isConfirming} loading={isConfirming}>
              Tasdiqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rad etish sababini kiriting</DialogTitle>
            <DialogDescription>Ushbu deklaratsiyani rad etish sababini batafsil tushuntirib bering.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Sababni yozing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={() => reject({ description })}
              disabled={isRejecting || !description}
              loading={isRejecting}
            >
              Rad etish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qaytarib yuborish sababini kiriting</DialogTitle>
            <DialogDescription>
              Ushbu deklaratsiyani tahrirlash uchun qaytarib yuborish sababini kiriting.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Sababni yozing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="destructiveOutline"
              onClick={() => cancel({ description })}
              disabled={isCanceling || !description}
              loading={isCanceling}
            >
              Qaytarib yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
