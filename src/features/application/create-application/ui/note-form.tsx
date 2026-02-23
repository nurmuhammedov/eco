import { ArrowRight, ExternalLink, OctagonAlert, TriangleAlert } from 'lucide-react'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { useParams } from 'react-router-dom'

export const NoteForm = ({
  equipmentName = 'qurilma',
  onlyLatin = false,
}: {
  equipmentName: string
  onlyLatin?: boolean
}) => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="mt-1 flex flex-col">
      {!onlyLatin && (
        <Alert className="bg-destructive/10 border-destructive/50 my-2">
          <OctagonAlert className="!text-destructive size-4" />
          <AlertTitle>
            Diqqat! Agar ro‘yxatga olinayotgan {equipmentName} biror XICHO tarkibida bo‘lsa, u holda avval ushbu XICHO
            mazkur axborot tizimida ro‘yxatdan o‘tgan bo‘lishi kerak!
          </AlertTitle>
        </Alert>
      )}
      {!!id ? (
        <Alert className="border-yellow-500/50 bg-yellow-500/15">
          <TriangleAlert className="size-4 !text-yellow-600" />
          <AlertTitle className="flex items-center justify-between text-yellow-700">
            <span>
              Maʼlumotlar lotinda kiritilsin, agar kirilda yozilgan bo‘lsa, tahrirlash jarayonida lotinga
              o‘zgartirilsin!
            </span>
            <a
              href="https://matn.uz/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              Kiril <ArrowRight className="size-3" /> Lotin <ExternalLink className="size-3" />
            </a>
          </AlertTitle>
        </Alert>
      ) : null}
    </div>
  )
}
