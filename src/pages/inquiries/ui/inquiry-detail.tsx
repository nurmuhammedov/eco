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
  // inquiryActionLabels,
  inquiryResultLabels,
  inquiryBelongTypeLabels,
} from '@/features/inquiries/model/types'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import SetInspectorModal from '@/features/inquiries/ui/modals/set-inspector-modal'
import ExecuteInitialModal from '@/features/inquiries/ui/modals/execute-initial-modal'
import ExecuteCourtModal from '@/features/inquiries/ui/modals/execute-court-modal'
import {
  RecoveredAmountModal,
  PaidRewardModal,
  MibStatusModal,
} from '@/features/inquiries/ui/modals/accountant-edit-modals'
import { AccountantCompleteModal } from '@/features/inquiries/ui/modals/accountant-complete-modal'

// emptyText removed

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

  const isCompletedEnabled =
    data?.recoveredAmount !== null &&
    data?.recoveredAmount !== undefined &&
    data?.paidRewardAmount !== null &&
    data?.paidRewardAmount !== undefined &&
    data?.isMib !== null &&
    data?.isMib !== undefined

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

          {user?.role === UserRoles.INSPECTOR && data?.status === InquiryStatus.IN_PROCESS && (
            <ExecuteInitialModal inquiryType={data?.type} />
          )}

          {user?.role === UserRoles.INSPECTOR && data?.status === InquiryStatus.IN_COURT && <ExecuteCourtModal />}

          {user?.role === UserRoles.ACCOUNTANT && data?.status === InquiryStatus.REWARD_PAYMENT && (
            <AccountantCompleteModal inquiryId={id!} disabled={!isCompletedEnabled} />
          )}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <DetailCardAccordion defaultValue={['general', 'applicant_info', 'administrative_info']}>
          <DetailCardAccordion.Item value="general" title="Murojaat va ijro maʼlumotlari">
            <div className="flex flex-col py-1">
              <DetailRow
                title="Murojaat raqami:"
                value={data?.registryNumber || <span className="font-medium text-red-500">Mavjud emas</span>}
              />
              <DetailRow
                title="Murojaat turi:"
                value={
                  data?.type ? (
                    appealTypeTranslations[data.type] || data.type
                  ) : (
                    <span className="font-medium text-red-500">Mavjud emas</span>
                  )
                }
              />
              <InquiryStatusRow status={data?.status} type={data?.type} />
              <DetailRow
                title="Murojaat qilingan sana:"
                value={
                  data?.createdAt ? (
                    formatDate(new Date(data.createdAt), 'dd.MM.yyyy HH:mm')
                  ) : (
                    <span className="font-medium text-red-500">Mavjud emas</span>
                  )
                }
              />
              <DetailRow
                title="Hodisa sodir bo‘lgan sana:"
                value={
                  data?.occurredAt ? (
                    formatDate(new Date(data.occurredAt), 'dd.MM.yyyy HH:mm')
                  ) : (
                    <span className="font-medium text-red-500">Mavjud emas</span>
                  )
                }
              />

              <DetailRow
                title="Mas’ul inspektor:"
                value={data?.executorName || <span className="font-medium text-red-500">Mavjud emas</span>}
              />
              <DetailRow
                title="Hudud:"
                value={data?.regionName || <span className="font-medium text-red-500">Mavjud emas</span>}
              />

              <DetailRow
                title="Murojaat matni:"
                value={data?.message || <span className="font-medium text-red-500">Mavjud emas</span>}
              />
              <DetailRow
                title="Ijro izohi:"
                value={data?.executionMessage || <span className="font-medium text-red-500">Mavjud emas</span>}
              />

              {user?.role !== UserRoles.ACCOUNTANT && (
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
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
              )}
            </div>
          </DetailCardAccordion.Item>

          {data?.type === 'RISK_APPEAL' && (
            <DetailCardAccordion.Item value="administrative_info" title="Ma’muriy ish ma’lumotlari">
              <div className="flex flex-col py-1">
                {/*<DetailRow title="Ijro harakati:" value={data?.action ? inquiryActionLabels[data.action] || data.action : <span className="font-medium text-red-500">Mavjud emas</span>} />*/}
                <DetailRow
                  title="Ijro natijasi:"
                  value={
                    data?.result ? (
                      inquiryResultLabels[data.result] || data.result
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                {/*<DetailRow title="To‘lov holati:" value={data?.isPaid !== undefined && data?.isPaid !== null ? (data.isPaid ? 'To‘landi' : 'To‘lanmadi') : <span className="font-medium text-red-500">Mavjud emas</span>} />*/}
                <DetailRow
                  title="Ajratilgan mukofot puli:"
                  value={
                    data?.rewardAmount !== null && data?.rewardAmount !== undefined ? (
                      `${Number(data.rewardAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                <DetailRow
                  title="Jarima miqdori:"
                  value={
                    data?.fineAmount !== null && data?.fineAmount !== undefined ? (
                      `${Number(data.fineAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                <DetailRow
                  title="Tashkilotdan undirilgan summa:"
                  value={
                    <div className="flex items-center gap-2">
                      {data?.recoveredAmount !== null && data?.recoveredAmount !== undefined ? (
                        `${Number(data.recoveredAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
                      ) : (
                        <span className="font-medium text-red-500">Mavjud emas</span>
                      )}
                      {user?.role === UserRoles.ACCOUNTANT && data?.status === InquiryStatus.REWARD_PAYMENT && (
                        <RecoveredAmountModal
                          inquiryId={id!}
                          defaultValue={data?.recoveredAmount}
                          fineAmount={data?.fineAmount}
                        />
                      )}
                    </div>
                  }
                />
                <DetailRow
                  title="MIB holati:"
                  value={
                    <div className="flex items-center gap-2">
                      {data?.isMib !== null && data?.isMib !== undefined ? (
                        data.isMib ? (
                          <span className="font-medium text-red-500">MIBga yuborildi</span>
                        ) : (
                          <span className="font-medium text-green-500">MIBga oshirilmadi</span>
                        )
                      ) : (
                        <span className="font-medium text-red-500">Mavjud emas</span>
                      )}
                      {user?.role === UserRoles.ACCOUNTANT && data?.status === InquiryStatus.REWARD_PAYMENT && (
                        <MibStatusModal inquiryId={id!} defaultValue={data?.isMib} />
                      )}
                    </div>
                  }
                />
                <DetailRow
                  title="To‘lab berilgan mukofot puli:"
                  value={
                    <div className="flex items-center gap-2">
                      {data?.paidRewardAmount !== null && data?.paidRewardAmount !== undefined ? (
                        `${Number(data.paidRewardAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
                      ) : (
                        <span className="font-medium text-red-500">Mavjud emas</span>
                      )}
                      {user?.role === UserRoles.ACCOUNTANT && data?.status === InquiryStatus.REWARD_PAYMENT && (
                        <PaidRewardModal
                          inquiryId={id!}
                          defaultValue={data?.paidRewardAmount}
                          defaultFile={data?.paymentExecutionFilePath}
                          rewardAmount={data?.rewardAmount}
                        />
                      )}
                    </div>
                  }
                />
                <DetailRow
                  title="To‘lanmaslik sababi:"
                  value={data?.rejectReason || <span className="font-medium text-red-500">Mavjud emas</span>}
                />

                <DetailRow
                  title="Boshlang‘ich ijro fayli:"
                  value={
                    data?.initialExecutionFilePath ? (
                      <FileLink url={data.initialExecutionFilePath} title="Faylni ko‘rish" />
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                <DetailRow
                  title="Sud qarori:"
                  value={
                    data?.courtExecutionFilePath ? (
                      <FileLink url={data.courtExecutionFilePath} title="Faylni ko‘rish" />
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                <DetailRow
                  title="To‘lov hujjati:"
                  value={
                    data?.paymentExecutionFilePath ? (
                      <FileLink url={data.paymentExecutionFilePath} title="Faylni ko‘rish" />
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
              </div>
            </DetailCardAccordion.Item>
          )}

          <DetailCardAccordion.Item value="applicant_info" title="Yuboruvchi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow
                title="Yuboruvchi F.I.SH.:"
                value={data?.fullName || <span className="font-medium text-red-500">Mavjud emas</span>}
              />
              <DetailRow
                title="Egasi PINFL/STIR:"
                value={data?.ownerIdentity || <span className="font-medium text-red-500">Mavjud emas</span>}
              />
              <DetailRow
                title="Telefon raqami:"
                value={data?.phoneNumber || <span className="font-medium text-red-500">Mavjud emas</span>}
              />
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
