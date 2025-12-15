import { OctagonAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'

export const NoteForm = ({ equipmentName = 'kran' }: { equipmentName: string }) => {
  return (
    <Alert className="bg-destructive/10 border-destructive/50 my-3">
      <OctagonAlert className="!text-destructive size-4" />
      <AlertTitle>
        Diqqat! Agar ro‘yxatga olinayotgan {equipmentName} biror XICHO tarkibida bo‘lsa, u holda avval ushbu XICHO
        mazkur axborot tizimida ro‘yxatdan o‘tgan bo‘lishi kerak!
      </AlertTitle>
    </Alert>
  )
}
