import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import { Skeleton } from '@/shared/components/ui/skeleton.tsx'

const LegalApplicantInfo = ({ tinNumber, phoneNumber, isShowPhoneNumber = false }: any) => {
  const { data, isLoading } = useLegalApplicantInfo(tinNumber)

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
      <DetailRow title="Tashkilot STIR:" value={data?.identity || '-'} />
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
