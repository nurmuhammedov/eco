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
import useData from '@/shared/hooks/api/useData'
import { formatDate } from 'date-fns'
import { cn } from '@/shared/lib/utils'
import { useState } from 'react'
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
import { CreateInquiryInspectionModal } from '@/features/inquiries/ui/modals/create-inquiry-inspection-modal'
import {
  RecoveredAmountModal,
  PaidRewardModal,
  MibStatusModal,
} from '@/features/inquiries/ui/modals/accountant-edit-modals'
import { AccountantCompleteModal } from '@/features/inquiries/ui/modals/accountant-complete-modal'

// emptyText removed

const getCardType = (number: string): 'UZCARD' | 'HUMO' | 'UNKNOWN' => {
  const clean = number?.replace(/\s+/g, '') || ''
  if (clean.startsWith('8600') || clean.startsWith('5614')) return 'UZCARD'
  if (clean.startsWith('9860')) return 'HUMO'
  return 'UNKNOWN'
}

const formatCardNumber = (value: string) => {
  if (!value) return ''
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  return parts.length ? parts.join(' ') : value
}

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [expandedCardId, setExpandedCardId] = useState<string | number | null>(null)

  const { data, isLoading } = useDetail<any>('/inquiries', id as string)

  const { data: inspectionByInquiry } = useDetail<any>(
    '/inspections/by-inquiry',
    id as string,
    (user?.role === UserRoles.REGIONAL && data?.status === InquiryStatus.UNDER_INSPECTION) ||
      (data?.type === 'VIOLATION_REPORT' &&
        data?.status !== InquiryStatus.NEW &&
        data?.status !== InquiryStatus.IN_PROCESS)
  )

  const { data: inquiryCards } = useData<any[]>(
    `/plastic-cards/by-inquiry/${id}`,
    user?.role === UserRoles.ACCOUNTANT && data?.type === 'VIOLATION_REPORT'
  )
  const cardsList = Array.isArray(inquiryCards) ? inquiryCards : []

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

          {user?.role === UserRoles.REGIONAL &&
            data?.status === InquiryStatus.UNDER_INSPECTION &&
            !inspectionByInquiry && <CreateInquiryInspectionModal inquiry={data} />}

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
        <DetailCardAccordion
          defaultValue={[
            'general',
            'applicant_info',
            'administrative_info',
            'inspection_info',
            'object_location',
            'appeal_files',
            'plastic_cards',
          ]}
        >
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

          {data?.type === 'VIOLATION_REPORT' && (
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
                  title="Tashkilotga qo‘llanilgan jarima summasi:"
                  value={
                    data?.imposedFineAmount !== null && data?.imposedFineAmount !== undefined ? (
                      `${Number(data.imposedFineAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                <DetailRow
                  title="E-ma’muriy tomonidan ushlangan komissiya yig‘imi:"
                  value={
                    data?.withholdingAmount !== null && data?.withholdingAmount !== undefined ? (
                      `${Number(data.withholdingAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
                    ) : (
                      <span className="font-medium text-red-500">Mavjud emas</span>
                    )
                  }
                />
                <DetailRow
                  title="Qo‘mitaga kelib tushadigan summa:"
                  value={
                    data?.transferFineAmount !== null && data?.transferFineAmount !== undefined ? (
                      `${Number(data.transferFineAmount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} so‘m`
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
                          fineAmount={data?.imposedFineAmount}
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
                  title={data?.action === 'SEND_TO_COURT' ? 'Sudga tayyorlangan hujjat:' : 'Asos hujjat:'}
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

          {data?.type === 'VIOLATION_REPORT' &&
            data?.status !== InquiryStatus.NEW &&
            data?.status !== InquiryStatus.IN_PROCESS &&
            inspectionByInquiry && (
              <DetailCardAccordion.Item value="inspection_info" title="Tekshiruv ma’lumotlari">
                <div className="flex flex-col py-1">
                  <DetailRow
                    title="Tashkilot nomi:"
                    value={
                      inspectionByInquiry?.legalName || <span className="font-medium text-red-500">Mavjud emas</span>
                    }
                  />
                  <DetailRow
                    title="Tashkilot STIR:"
                    value={
                      inspectionByInquiry?.legalTin || <span className="font-medium text-red-500">Mavjud emas</span>
                    }
                  />
                  <DetailRow
                    title="Tekshiruv sanasi:"
                    value={
                      inspectionByInquiry?.startDate && inspectionByInquiry?.endDate ? (
                        `${formatDate(new Date(inspectionByInquiry.startDate), 'dd.MM.yyyy')} - ${formatDate(new Date(inspectionByInquiry.endDate), 'dd.MM.yyyy')}`
                      ) : (
                        <span className="font-medium text-red-500">Mavjud emas</span>
                      )
                    }
                  />
                  <DetailRow
                    title="Inspektorlar:"
                    value={
                      inspectionByInquiry?.inspectors?.length > 0 ? (
                        inspectionByInquiry.inspectors.map((i: any) => i.name).join(', ')
                      ) : (
                        <span className="font-medium text-red-500">Mavjud emas</span>
                      )
                    }
                  />
                  <DetailRow
                    title="Buyruq raqami:"
                    value={
                      inspectionByInquiry?.decreeNumber || <span className="font-medium text-red-500">Mavjud emas</span>
                    }
                  />
                  <DetailRow
                    title="Tekshiruv dasturi:"
                    value={
                      inspectionByInquiry?.programPath ? (
                        <FileLink url={inspectionByInquiry.programPath} title="Faylni ko‘rish" />
                      ) : (
                        <span className="font-medium text-red-500">Mavjud emas</span>
                      )
                    }
                  />
                  <DetailRow
                    title="Buyruq fayli:"
                    value={
                      inspectionByInquiry?.decree?.path ? (
                        <FileLink url={inspectionByInquiry.decree.path} title="Faylni ko‘rish" />
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

          {user?.role === UserRoles.ACCOUNTANT && data?.type === 'VIOLATION_REPORT' && cardsList.length > 0 && (
            <DetailCardAccordion.Item value="plastic_cards" title="Murojaatchining plastik kartalari">
              <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
                {cardsList.map((card, idx) => {
                  const cardId = card.id || idx
                  const isExpanded = expandedCardId === cardId
                  const typeVal = getCardType(card.cardNumber)
                  const formattedNum = formatCardNumber(card.cardNumber) || '0000 0000 0000 0000'
                  const exp = card.expirationDate || card.expiryDate || ''
                  const formattedExp =
                    exp && !exp.includes('/') && exp.length === 4
                      ? `${exp.substring(0, 2)}/${exp.substring(2, 4)}`
                      : exp || 'MM/YY'

                  return (
                    <div
                      key={cardId}
                      className="group relative h-48 w-full max-w-sm cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onClick={() => setExpandedCardId(isExpanded ? null : cardId)}
                    >
                      <div
                        className={cn(
                          'h-full w-full transition-transform duration-700',
                          isExpanded ? '[transform:rotateY(180deg)]' : ''
                        )}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }}>
                          <div
                            className={cn(
                              'relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] border border-blue-400/50 p-6 text-white shadow-md',
                              'bg-gradient-to-bl from-blue-400 via-blue-500 to-blue-600'
                            )}
                          >
                            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl" />

                            <div className="relative z-10 flex items-center justify-between">
                              <div className="text-xl font-bold tracking-[0.2em] text-white">
                                {typeVal === 'UZCARD' ? 'UZCARD' : typeVal === 'HUMO' ? 'HUMO' : 'KARTA'}
                              </div>
                              <div className="relative flex h-9 w-12 items-center justify-center overflow-hidden rounded-[6px] border-[0.5px] border-yellow-600/50 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-sm">
                                <div className="absolute top-1/2 left-0 h-[0.5px] w-full bg-yellow-700/40" />
                                <div className="absolute top-0 left-1/2 h-full w-[0.5px] bg-yellow-700/40" />
                                <div className="absolute h-5 w-6 rounded-sm border-[0.5px] border-yellow-700/40" />
                              </div>
                            </div>

                            <div className="relative z-10 mt-8 flex items-center justify-between">
                              <div className="font-mono text-[22px] tracking-[0.2em] text-white drop-shadow-sm">
                                {formattedNum}
                              </div>
                            </div>

                            <div className="relative z-10 mt-auto flex items-end justify-between">
                              <div className="flex flex-col">
                                <span className="mb-1 text-[9px] tracking-[0.15em] text-blue-100 uppercase">
                                  Amal qilish
                                </span>
                                <span className="font-mono text-base tracking-widest text-white">{formattedExp}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div
                          className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-blue-200/50 bg-blue-50 shadow-md"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          <div className="mt-6 h-12 w-full border-y border-slate-300 bg-slate-800 shadow-sm" />

                          <div className="mt-6 flex flex-1 flex-col gap-4 px-6">
                            <div className="flex flex-col border-b border-blue-200 pb-2">
                              <span className="mb-1 text-[10px] tracking-widest text-slate-500">TRANZIT RAQAM</span>
                              <span className="text-[17px] font-medium tracking-widest text-slate-700">
                                {card.transitAccount || '-'}
                              </span>
                            </div>
                            <div className="flex flex-col border-b border-blue-200 pb-2">
                              <span className="mb-1 text-[10px] tracking-widest text-slate-500">MFO KODI</span>
                              <span className="text-[17px] font-medium tracking-widest text-slate-700">
                                {card.bankInfo || '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </DetailCardAccordion.Item>
          )}

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
