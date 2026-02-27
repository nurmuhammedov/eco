import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import ObjectsList from '@/features/inspections/ui/parts/objects-list.tsx'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoles } from '@/entities/user'
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts'
import InspectionsDetailInfo from '@/features/inspections/ui/parts/inpections-detail-info.tsx'
import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts'
import { InspectionStatus } from '@/widgets/inspection/ui/inspection-widget.tsx'
import { useObjectList } from '@/features/inspections/hooks/use-object-list'
import { useData } from '@/shared/hooks'
import InspectionReports from '@/features/inspections/ui/parts/inspection-reports.tsx'

const InspectionsInfo = () => {
  const {
    paramsObject: { tin: currentTin = '', name = '', inspectionId = '' },
  } = useCustomSearchParams()
  const { user } = useAuth()
  const { data: inspectionData } = useInspectionDetail()
  const { data } = useObjectList()
  const { data: accordions = [] } = useData<any[]>('/inspection-results', !!inspectionId, {
    inspectionId,
  })

  const typesList = [
    ...(data && data?.HF && Array.isArray(data?.HF) ? data.HF : []),
    ...(data && data?.ELEVATOR && Array.isArray(data?.ELEVATOR) ? data.ELEVATOR : []),
    ...(data && data?.ATTRACTION && Array.isArray(data?.ATTRACTION) ? data.ATTRACTION : []),
    ...(data && data?.IRS && Array.isArray(data?.IRS) ? data.IRS : []),
    ...(data && data?.XRAY && Array.isArray(data?.XRAY) ? data.XRAY : []),
    ...(data && data?.LPG_POWERED && Array.isArray(data?.LPG_POWERED) ? data.LPG_POWERED : []),
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Tashkilot: ${name} (${currentTin})`} />
      </div>
      <DetailCardAccordion defaultValue={['risk_anlalysis_info', 'inspection_info']}>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="risk_anlalysis_info" title={`Xavfni tahlil qilish bo‘yicha ma’lumotlar`}>
          {user?.role === UserRoles.REGIONAL && inspectionData?.status === InspectionStatus.NEW && (
            <div className="flex justify-end py-2">
              <AttachInspectorModal data={typesList || []} />
            </div>
          )}
          <ObjectsList />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="inspection_info" title={`Tekshiruv ma’lumotlari`}>
          <InspectionsDetailInfo inspectionData={inspectionData} />
        </DetailCardAccordion.Item>
        {accordions?.length > 0 &&
          accordions?.map((item: any) => (
            <DetailCardAccordion.Item
              key={item.id}
              value={`inspection_results-${item?.id}`}
              title={`Tekshiruv dasturi  (${item?.belongRegistryNumber} - ${item?.belongName})`}
            >
              <InspectionReports
                status={item?.status}
                specialCode={item?.specialCode}
                acknowledgementPath={item?.acknowledgementPath}
                signedActPath={item?.signedActPath}
                act={item?.act}
                resultId={item?.id}
              />
            </DetailCardAccordion.Item>
          ))}
      </DetailCardAccordion>
    </>
  )
}

export default InspectionsInfo
