import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { useAccountantComplete } from '@/features/inquiries/hooks/use-inquiry-mutations'

export const AccountantCompleteModal = ({ inquiryId, disabled }: { inquiryId: string; disabled?: boolean }) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useAccountantComplete()

  const handleComplete = async () => {
    await mutateAsync(inquiryId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Yakunlash</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yakunlash</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Siz ushbu arizani yakunlamoqchisiz. Bunga ishonchingiz komilmi?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Yo‘q
          </Button>
          <Button onClick={handleComplete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ha, yakunlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
