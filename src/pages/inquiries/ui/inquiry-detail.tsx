import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { apiConfig } from '@/shared/api/constants'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { InquiryStatusRow } from '@/shared/components/common/inquiry-status-row'
import FileLink from '@/shared/components/common/file-link'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import useDetail from '@/shared/hooks/api/useDetail'
import { formatDate } from 'date-fns'
import {
  appealTypeTranslations,
  InquiryStatus,
  inquiryActionLabels,
  inquiryResultLabels,
  inquiryBelongTypeLabels,
} from '@/features/inquiries/model/types'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import SetInspectorModal from '@/features/inquiries/ui/modals/set-inspector-modal'
import ExecuteInitialModal from '@/features/inquiries/ui/modals/execute-initial-modal'
import ExecuteCourtModal from '@/features/inquiries/ui/modals/execute-court-modal'
import ExecutePaymentModal from '@/features/inquiries/ui/modals/execute-payment-modal'

const emptyText = <span className="font-medium text-red-500">Mavjud emas</span>

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
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
        <GoBack title={`Murojaat raqami: ${data?.registryNumber || ''}`} />
        <div className="flex gap-2">
          {user?.role === UserRoles.REGIONAL && data?.status === InquiryStatus.NEW && (
            <>
              <SetInspectorModal />
            </>
          )}

          {user?.role === UserRoles.INSPECTOR && data?.status === InquiryStatus.IN_PROCESS && <ExecuteInitialModal />}

          {user?.role === UserRoles.INSPECTOR && data?.status === InquiryStatus.IN_COURT && <ExecuteCourtModal />}

          {user?.role === UserRoles.ACCOUNTANT && data?.status === InquiryStatus.REWARD_PAYMENT && (
            <ExecutePaymentModal />
          )}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <DetailCardAccordion defaultValue={['general', 'applicant_info']}>
          <DetailCardAccordion.Item value="general" title="Murojaat va ijro maʼlumotlari">
            <div className="flex flex-col py-1">
              <DetailRow title="Murojaat raqami:" value={data?.registryNumber || emptyText} />
              <DetailRow
                title="Murojaat turi:"
                value={data?.type ? appealTypeTranslations[data?.type] || data.type : emptyText}
              />
              <InquiryStatusRow status={data?.status} />
              <DetailRow
                title="Murojaat qilingan sana:"
                value={data?.createdAt ? formatDate(new Date(data.createdAt), 'dd.MM.yyyy HH:mm') : emptyText}
              />
              <DetailRow
                title="Hodisa sodir bo‘lgan sana:"
                value={data?.occurredAt ? formatDate(new Date(data.occurredAt), 'dd.MM.yyyy HH:mm') : emptyText}
              />

              {data?.action && (
                <DetailRow title="Ijro harakati:" value={inquiryActionLabels[data.action] || data.action} />
              )}
              {data?.result && (
                <DetailRow title="Ijro natijasi:" value={inquiryResultLabels[data.result] || data.result} />
              )}
              {data?.executorName && <DetailRow title="Mas’ul inspektor:" value={data.executorName} />}
              {data?.regionName && <DetailRow title="Hudud:" value={data.regionName} />}
              {data?.rewardAmount !== null && data?.rewardAmount !== undefined && (
                <DetailRow title="To‘lov miqdori:" value={`${data.rewardAmount} UZS`} />
              )}
              {data?.executionMessage && <DetailRow title="Ijro izohi:" value={data.executionMessage} />}

              {data?.initialExecutionFilePath && (
                <DetailRow
                  title="Boshlang‘ich ijro fayli:"
                  value={<FileLink url={data.initialExecutionFilePath} title="Faylni ko‘rish" />}
                />
              )}
              {data?.courtExecutionFilePath && (
                <DetailRow
                  title="Sud qarori fayli:"
                  value={<FileLink url={data.courtExecutionFilePath} title="Faylni ko‘rish" />}
                />
              )}
              {data?.paymentExecutionFilePath && (
                <DetailRow
                  title="To‘lov hujjati fayli:"
                  value={<FileLink url={data.paymentExecutionFilePath} title="Faylni ko‘rish" />}
                />
              )}

              <DetailRow title="Murojaat matni:" value={data?.message || emptyText} />

              <DetailRow
                title="Obyekt:"
                value={
                  data?.belongId ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {data?.belongType ? inquiryBelongTypeLabels[data.belongType] || data.belongType : ''}
                      </span>
                      <Button size="sm" onClick={() => navigate(`/register/${data.belongId}/${belongTypeStr}`)}>
                        Obyektni ko‘rish
                      </Button>
                    </div>
                  ) : (
                    emptyText
                  )
                }
              />
            </div>
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="applicant_info" title="Yuboruvchi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow title="Yuboruvchi F.I.SH.:" value={data?.fullName || emptyText} />
              {data?.ownerIdentity && <DetailRow title="Egasi PINFL/STIR:" value={data.ownerIdentity} />}
              {data?.cardNumber && <DetailRow title="Plastik karta raqami:" value={data.cardNumber} />}
              <DetailRow title="Telefon raqami:" value={data?.phoneNumber || emptyText} />
            </div>
          </DetailCardAccordion.Item>

          {hasLocation && (
            <DetailCardAccordion.Item value="object_location" title="Hodisa sodir bo‘lgan joy">
              <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
            </DetailCardAccordion.Item>
          )}

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
        </DetailCardAccordion>
      </div>
    </>
  )
}

export default InquiryDetailPage
