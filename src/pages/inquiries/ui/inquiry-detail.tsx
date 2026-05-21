import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { apiConfig } from '@/shared/api/constants'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import useDetail from '@/shared/hooks/api/useDetail'
import { formatDate } from 'date-fns'
import { appealTypeTranslations } from '@/features/inquiries/model/types'

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useDetail<any>('/inquiries', id as string)

  const currentObjLocation = data?.location?.split(',').map(Number) || ([] as Coordinate[])
  const hasLocation = currentObjLocation.length === 2 && !isNaN(currentObjLocation[0])
  const files = data?.filePathList || []

  const belongTypeStr =
    data?.belongType === 'HF'
      ? 'hf'
      : data?.belongType === 'EQUIPMENT'
        ? 'equipments'
        : data?.belongType === 'IRS'
          ? 'irs'
          : 'xrays'

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>
  }

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Maʼlumot topilmadi.</div>
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <GoBack title={`Murojaat raqami: ${data?.registryNumber || '-'}`} />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <DetailCardAccordion defaultValue={['general', 'applicant_info', 'appeal_files', 'object_location']}>
          <DetailCardAccordion.Item value="general" title="Murojaat va umumiy maʼlumotlar">
            <div className="flex flex-col py-1">
              <DetailRow title="Murojaat raqami:" value={data?.registryNumber || '-'} />
              <DetailRow
                title="Murojaat turi:"
                value={data?.type ? appealTypeTranslations[data?.type] || data.type : '-'}
              />
              <DetailRow
                title="Murojaat qilingan sana:"
                value={data?.createdAt ? formatDate(new Date(data.createdAt), 'dd.MM.yyyy HH:mm') : '-'}
              />
              <DetailRow
                title="Hodisa sodir bo'lgan sana:"
                value={data?.occurredAt ? formatDate(new Date(data.occurredAt), 'dd.MM.yyyy HH:mm') : '-'}
              />
              <DetailRow title="Murojaat matni:" value={data?.message || '-'} />
              <DetailRow
                title="Obyekt:"
                value={
                  data?.belongId ? (
                    <div className="flex items-center gap-4">
                      <Button size="sm" onClick={() => navigate(`/register/${data.belongId}/${belongTypeStr}`)}>
                        Obyektni ko'rish
                      </Button>
                    </div>
                  ) : (
                    '-'
                  )
                }
              />
              {data?.cardNumber && <DetailRow title="Plastik karta raqami:" value={data.cardNumber} />}
            </div>
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="applicant_info" title="Yuboruvchi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow title="Yuboruvchi F.I.SH.:" value={data?.fullName || '-'} />
              <DetailRow title="Telefon raqami:" value={data?.phoneNumber || '-'} />
            </div>
          </DetailCardAccordion.Item>

          {files.length > 0 && (
            <DetailCardAccordion.Item value="appeal_files" title="Murojaatga biriktirilgan fayllar">
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {files.map((fileUrl: string, idx: number) => (
                  <a
                    key={idx}
                    href={`${apiConfig?.baseURL}${fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-slate-50 transition-all hover:opacity-90"
                  >
                    <img
                      src={`${apiConfig?.baseURL}${fileUrl}`}
                      alt={`Fayl ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </DetailCardAccordion.Item>
          )}

          {hasLocation && (
            <DetailCardAccordion.Item value="object_location" title="Hodisa sodir bo‘lgan joy">
              <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
            </DetailCardAccordion.Item>
          )}
        </DetailCardAccordion>
      </div>
    </>
  )
}

export default InquiryDetailPage
