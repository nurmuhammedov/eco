import { usePreventionDetail } from '@/entities/prevention'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { useParams } from 'react-router-dom'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { Badge } from '@/shared/components/ui/badge'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { ExecutionInspectorModal, preventionTypes } from '@/features/prevention/ui/parts/inspector-execution-modal'

export default function PreventionViewPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const {
    paramsObject: { tin: currentTin = '' },
  } = useCustomSearchParams()
  const { data: prevention } = usePreventionDetail(id!)
  let currentType = prevention?.data?.belongType

  if (currentType !== 'HF' && currentType !== 'IRS') {
    currentType = 'equipments'
  }

  const { data } = useData(
    `/${currentType?.toLowerCase()}/${prevention?.data?.belongId}`,
    !!prevention?.data?.belongType && !!prevention?.data?.belongId
  )

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <GoBack title="Profilaktika tadbiri" />
        {user?.role === UserRoles.INSPECTOR && prevention?.data?.status == 'NEW' && <ExecutionInspectorModal />}
      </div>
      <div className="mt-4">
        <DetailCardAccordion defaultValue={['main']}>
          <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
            <LegalApplicantInfo tinNumber={currentTin} />
          </DetailCardAccordion.Item>
          <DetailCardAccordion.Item value="object_info" title="Tashkilot obyektlari va qurilmalari">
            <AppealMainInfo
              data={data}
              type={prevention?.data?.belongType?.toUpperCase()}
              address={prevention?.data?.address}
            />
          </DetailCardAccordion.Item>
          <DetailCardAccordion.Item value="main" title="Profilaktika maʼlumotlar va qayta ishlash">
            <DetailRow title="Hisobga olish raqami" value={prevention?.data?.registryNumber} />
            <DetailRow title="Hudud" value={prevention?.data?.regionName} />
            <DetailRow title="Tashkilot nomi" value={prevention?.data?.ownerName} />
            <DetailRow title="Tashkilot STIR" value={prevention?.data?.identity} />
            <DetailRow title="Tashkilot manzili" value={prevention?.data?.address} />
            <DetailRow
              title="Holati"
              value={
                prevention?.data?.status ? (
                  prevention?.data?.status == 'CONDUCTED' ? (
                    <Badge variant="success">Bajrilgan</Badge>
                  ) : (
                    <Badge variant="info">Yangi</Badge>
                  )
                ) : (
                  '-'
                )
              }
            />
            <DetailRow title="Inspektor" value={prevention?.data?.executorName || '-'} />
            <DetailRow
              title="Profilaktika turi"
              value={
                prevention?.data?.type
                  ? preventionTypes?.find((i) => i?.id == prevention?.data?.type)?.name || '-'
                  : '-'
              }
            />
            <div className="grid grid-cols-2 content-center items-center gap-1 rounded-lg px-2.5 py-2 odd:bg-neutral-50">
              <h2 className="text-normal font-normal text-gray-700">Bajarilgan ishlar ro‘yxati</h2>
              <p
                className="text-normal font-normal whitespace-pre-wrap text-gray-900"
                dangerouslySetInnerHTML={{ __html: prevention?.data?.report || '-' }}
              />
            </div>
          </DetailCardAccordion.Item>
        </DetailCardAccordion>
      </div>
    </div>
  )
}
