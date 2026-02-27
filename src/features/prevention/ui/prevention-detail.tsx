import { useParams } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { ExecutionInspectorModal, preventionTypes } from '@/features/prevention/ui/parts/inspector-execution-modal'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams, useData, useDetail } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import FileLink from '@/shared/components/common/file-link'

const PreventionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { paramsObject } = useCustomSearchParams()
  const { data: details } = useDetail<any>('/preventions/', id)

  const tin = paramsObject.tin || ''

  const requestType =
    details?.belongType === 'HF' || details?.belongType === 'IRS'
      ? details.belongType
      : details?.belongType === 'XRAY'
        ? 'xrays'
        : 'equipments'

  const { data: objectData } = useData(
    `/${requestType.toLowerCase()}/${details?.belongId}`,
    !!details?.belongType && !!details?.belongId
  )

  const preventionTypeName = details?.type ? preventionTypes.find((i) => i.id === details.type)?.name : '-'
  const isCancelled = details?.status === 'CANCELLED'
  const showExecutionModal =
    details?.status === 'NEW' &&
    ((user?.role === UserRoles.MANAGER && (details?.belongType === 'IRS' || details?.belongType === 'XRAY')) ||
      (user?.role === UserRoles.INSPECTOR && details?.belongType !== 'IRS' && details?.belongType !== 'XRAY'))
  const hasFiles = details?.resultPathList && details.resultPathList.length > 0

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <GoBack title="Profilaktika tadbiri" />
        {showExecutionModal && <ExecutionInspectorModal />}
        {isCancelled && <span className="font-medium text-red-500">Tizim tomonidan bekor qilingan</span>}
      </div>

      <div className="mt-4">
        <DetailCardAccordion defaultValue={['main']}>
          <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
            <LegalApplicantInfo tinNumber={tin} />
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="object_info" title="Tashkilot obyektlari va qurilmalari">
            <AppealMainInfo data={objectData} type={details?.belongType?.toUpperCase()} address={details?.address} />
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="main" title="Profilaktika maʼlumotlar va qayta ishlash">
            <DetailRow title="Roʻyxatga olish raqami" value={details?.registryNumber} />
            <DetailRow title="Hudud" value={details?.regionName} />
            <DetailRow title="Tashkilot nomi" value={details?.ownerName} />
            <DetailRow title="Tashkilot STIR" value={details?.identity} />
            <DetailRow title="Tashkilot manzili" value={details?.address} />
            <DetailRow
              title="Holati"
              value={
                details?.status ? (
                  details.status === 'CONDUCTED' ? (
                    <Badge variant="success">Bajarilgan</Badge>
                  ) : details.status === 'CANCELLED' ? (
                    <span className="font-medium text-red-500">Tizim tomonidan bekor qilingan</span>
                  ) : (
                    <Badge variant="info">Yangi</Badge>
                  )
                ) : (
                  '-'
                )
              }
            />
            <DetailRow title="Inspektor" value={details?.executorName || '-'} />
            <DetailRow title="Profilaktika turi" value={preventionTypeName || '-'} />

            <div className="grid grid-cols-2 content-center items-center gap-1 rounded-lg px-2.5 py-2 odd:bg-neutral-50">
              <h2 className="text-normal font-normal text-gray-700">Bajarilgan ishlar ro‘yxati</h2>
              <p
                className="text-normal font-normal whitespace-pre-wrap text-gray-900"
                dangerouslySetInnerHTML={{ __html: details?.report || '-' }}
              />
            </div>

            {hasFiles && (
              <div className="grid grid-cols-2 content-center items-center gap-1 rounded-lg px-2.5 py-2 odd:bg-neutral-50">
                <h2 className="text-normal font-normal text-gray-700">Bajarilgan ishlar bo‘yicha fayllar</h2>
                <div className="flex flex-wrap gap-2">
                  {details.resultPathList.map((path: string, index: number) => (
                    <FileLink key={index} url={path} />
                  ))}
                </div>
              </div>
            )}
          </DetailCardAccordion.Item>
        </DetailCardAccordion>
      </div>
    </div>
  )
}

export default PreventionDetail
