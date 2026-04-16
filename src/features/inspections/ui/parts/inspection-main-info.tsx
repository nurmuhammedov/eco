import DetailRow from '@/shared/components/common/detail-row.tsx'
import { getDate } from '@/shared/utils/date.ts'
import FileLink from '@/shared/components/common/file-link.tsx'
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal.tsx'
import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'

const InspectionMainInfo = ({ inspectionData }: any) => {
  const [signers, setSigners] = useState<any[]>([])
  const {
    paramsObject: { year = new Date().getFullYear() },
  } = useCustomSearchParams()

  const { data, isLoading } = useData<any>(
    `/integration/postal-mail/${inspectionData?.notificationLetterId}`,
    !!inspectionData &&
      !!inspectionData?.notificationLetterStatus &&
      !!inspectionData?.notificationLetterId &&
      inspectionData?.notificationLetterStatus !== 'RECEIVED_BY_CLIENT'
  )

  const { data: programs } = useData<any>(`/programs/by-year`, !!year, {
    year,
  })

  if (!inspectionData) {
    return null
  }

  return (
    <div className="flex flex-col pb-4">
      <DetailRow
        title="Tekshiruv dasturi:"
        value={
          !!programs?.path ? (
            <FileLink url={programs?.path} title={`${year} yil tekshiruv dasturi`} />
          ) : (
            <span className="text-red-500">Mavjud emas</span>
          )
        }
      />
      <DetailRow
        title="Tekshiruv sanasi:"
        value={getDate(inspectionData?.startDate) + ' - ' + getDate(inspectionData?.endDate)}
      />
      {inspectionData?.inspectors?.map((item: any, idx: number) => {
        return <DetailRow key={item.id} title={`Tekshiruvchi inspektor ${idx + 1}:`} value={item?.name} />
      })}
      <DetailRow
        title="Tekshiruv buyrug‘i:"
        value={
          !!inspectionData?.decree?.path ? (
            <div className="flex items-center gap-2">
              <span>{getDate(inspectionData?.decree?.createdAt) || '-'}</span> |
              <span>{inspectionData?.decreeNumber || '-'}</span> |
              <FileLink url={inspectionData?.decree?.path} />
              <button
                className="cursor-pointer text-[#A6B1BB] transition-colors hover:text-yellow-200"
                onClick={() => {
                  setSigners(inspectionData?.decree?.signers || [])
                }}
              >
                <Eye size="18" />
              </button>
            </div>
          ) : (
            <span className="text-red-500">Mavjud emas</span>
          )
        }
      />
      <DetailRow
        title="Xabardor qilish xati:"
        value={
          isLoading ? (
            <Skeleton className="h-5 w-40" />
          ) : inspectionData?.notificationLetterPath ? (
            <div className="flex flex-wrap items-center gap-2">
              <FileLink url={inspectionData?.notificationLetterPath} /> | <span>Gibrid pochta holati: </span>
              <Badge variant="info" className="text-sm">
                {inspectionData?.notificationLetterStatus === 'RECEIVED_BY_CLIENT'
                  ? 'Mijoz qabul qildi'
                  : data === 'SENT_TO_POST'
                    ? 'Pochtaga yuborildi'
                    : data === 'INSUFFICIENT_FUNDS'
                      ? 'Hisob yetarli emas'
                      : data === 'SENT_TO_CLIENT'
                        ? 'Mijozga yuborildi'
                        : data === 'UNKNOWN'
                          ? 'Noaniq'
                          : 'Noaniq'}
              </Badge>{' '}
              |{' '}
              <span>
                Yuborilgan sana:{' '}
                {inspectionData?.notificationLetterDate ? getDate(inspectionData?.notificationLetterDate) : '-'}
              </span>
            </div>
          ) : (
            <span className="text-red-500">Mavjud emas</span>
          )
        }
      />
      <SignersModal setSigners={setSigners} signers={signers} />
    </div>
  )
}

export default InspectionMainInfo
