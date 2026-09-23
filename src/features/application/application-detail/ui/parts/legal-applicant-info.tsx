import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import DetailRow from '@/shared/components/common/detail-row'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { useData } from '@/shared/hooks'

interface TrainedEmployees {
  managerCount: number | null
  engineerCount: number | null
}

/** Staff the organization has had trained at the partner training centre */
const TrainedEmployeesRows = ({ tinNumber }: { tinNumber: string }) => {
  const { data } = useData<TrainedEmployees>('/integration/ktnu/trained-employees', !!tinNumber, {
    legalTin: tinNumber,
  })

  return (
    <>
      <DetailRow
        title="“Kontexnazoratoʻquv” DMda malaka oshirgan rahbar xodimlar soni:"
        value={data?.managerCount ?? <EmptyValue />}
      />
      <DetailRow
        title="“Kontexnazoratoʻquv” DMda malaka oshirgan muhandis-texnik xodimlar soni:"
        value={data?.engineerCount ?? <EmptyValue />}
      />
    </>
  )
}

const LegalApplicantInfo = ({
  tinNumber,
  phoneNumber,
  isShowPhoneNumber = false,
  showTrainedEmployees = false,
}: any) => {
  const { data, isLoading } = useLegalOrganizationQuery(tinNumber)

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
    return <div className="p-4 text-center text-sm font-medium text-gray-500">Tashkilot ma’lumotlari topilmadi</div>
  }
  return (
    <div className="flex flex-col py-1">
      <DetailRow title="Tashkilot STIR:" value={data?.identity || <EmptyValue />} />

      <DetailRow title="Tashkilot nomi:" value={data?.name || <EmptyValue />} />
      <DetailRow title="Tashkilot rahbari F.I.SH.:" value={data?.directorName || <EmptyValue />} />
      <DetailRow title="Tashkilot manzili:" value={data?.address || <EmptyValue />} />
      <DetailRow title="Tashkilot telefon raqami:" value={data?.phoneNumber || <EmptyValue />} />
      <DetailRow
        title="Tashkilotning faoliyat yuritish holati:"
        value={
          data?.isActive == true ? (
            <span className="text-green-600">Faol</span>
          ) : data?.isActive == false ? (
            <span className="text-red-600">Faol emas</span>
          ) : (
            <EmptyValue />
          )
        }
      />
      {showTrainedEmployees && <TrainedEmployeesRows tinNumber={data?.identity ?? tinNumber} />}
      {isShowPhoneNumber ? (
        <DetailRow title="Arizada bog‘lanish uchun ko‘rsatilgan telefon raqam:" value={phoneNumber || <EmptyValue />} />
      ) : null}
    </div>
  )
}

export default LegalApplicantInfo
