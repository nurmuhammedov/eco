import { OctagonAlert, TriangleAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { useCustomSearchParams } from '@/shared/hooks'

export const NoteForm = ({ equipmentName = 'kran' }: { equipmentName: string }) => {
  const {
    paramsObject: { tin, id },
  } = useCustomSearchParams()
  return (
    <div className="flex flex-col">
      <Alert className="bg-destructive/10 border-destructive/50 my-3">
        <OctagonAlert className="!text-destructive size-4" />
        <AlertTitle>
          Diqqat! Agar ro‘yxatga olinayotgan {equipmentName} biror XICHO tarkibida bo‘lsa, u holda avval ushbu XICHO
          mazkur axborot tizimida ro‘yxatdan o‘tgan bo‘lishi kerak!
        </AlertTitle>
      </Alert>
      {!!tin && !!id ? (
        <Alert className="border-yellow-500/50 bg-yellow-500/15">
          <TriangleAlert className="size-4 !text-yellow-600" />
          <AlertTitle className="text-yellow-700">
            Maʼlumotlar lotin harfida kiritilsin, agar kirilda yozilgan bo‘lsa, tahrirlash jarayonida avtomatik o‘chirib
            yuboriladi!
          </AlertTitle>
        </Alert>
      ) : null}
    </div>
  )
}
