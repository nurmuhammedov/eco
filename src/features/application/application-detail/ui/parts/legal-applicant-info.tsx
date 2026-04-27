import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import { Skeleton } from '@/shared/components/ui/skeleton.tsx'
import { Button } from '@/shared/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys'
import useUpdate from '@/shared/hooks/api/useUpdate'
import { RefreshCcw } from 'lucide-react'

const LegalApplicantInfo = ({ tinNumber, phoneNumber, isShowPhoneNumber = false, showUpdateButton = false }: any) => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useLegalApplicantInfo(tinNumber)

  const { mutate, isPending } = useUpdate('/users/legal', tinNumber, 'put', 'Ma’lumotlarni muvaffaqiyatli yangilandi!')

  const handleUpdate = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS, 'APPLICANT_INFO', tinNumber] })
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 pb-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between border-b border-dashed border-gray-200 py-3 last:border-none"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </div>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="text-center text-sm font-medium text-gray-500">Tashkilot ma’lumotlari topilmadi</div>
        {showUpdateButton && (
          <Button size="sm" className="w-full gap-2" onClick={handleUpdate} disabled={isPending}>
            <RefreshCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            Ma’lumotlarni yangilash
          </Button>
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-col py-1">
      <DetailRow
        title="Tashkilot STIR:"
        value={
          <div className="flex justify-between">
            <div>{data?.identity || '-'}</div>
            {showUpdateButton && (
              <Button size="sm" className="gap-2" onClick={handleUpdate} disabled={isPending}>
                <RefreshCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                Ma’lumotlarni yangilash
              </Button>
            )}
          </div>
        }
      />

      <DetailRow title="Tashkilot nomi:" value={data?.name || '-'} />
      <DetailRow title="Tashkilot rahbari F.I.SH.:" value={data?.directorName || '-'} />
      <DetailRow title="Tashkilot manzili:" value={data?.address || '-'} />
      <DetailRow title="Tashkilot telefon raqami:" value={data?.phoneNumber || '-'} />
      <DetailRow
        title="Tashkilotning faoliyat yuritish holati:"
        value={
          data?.isActive == true ? (
            <span className="text-green-600">Faol</span>
          ) : data?.isActive == false ? (
            <span className="text-red-600">Faol emas</span>
          ) : (
            '-'
          )
        }
      />
      {isShowPhoneNumber ? (
        <DetailRow title="Arizada bog‘lanish uchun ko‘rsatilgan telefon raqam:" value={phoneNumber || '-'} />
      ) : null}
    </div>
  )
}

export default LegalApplicantInfo
