import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { useParams } from 'react-router-dom'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { tabs } from '@/features/register/auto/ui/auto-tabs'

export default function PreventionViewPage() {
  const { id } = useParams<{ id: string }>()
  const {
    paramsObject: { tin: currentTin = '' },
  } = useCustomSearchParams()
  const { data } = useData<any>(`/tankers/${id}`)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <GoBack title="Transport vositasi" />
      </div>
      <div className="mt-4">
        <DetailCardAccordion defaultValue={['main', 'auto']}>
          <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
            <LegalApplicantInfo tinNumber={currentTin} />
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="main" title="Xulosa">
            <DetailRow title="Xulosa raqami" value={data?.registerNumber || '-'} />
            <DetailRow
              title="Xulosa berilgan sana"
              value={data?.registrationDate ? formatDate(data?.registrationDate, 'dd.MM.yyyy') : '-'}
            />
            <DetailRow
              title="Xulosa amal qilish muddati"
              value={data?.expiryDate ? formatDate(data?.expiryDate, 'dd.MM.yyyy') : '-'}
            />
            <DetailRow
              title="Faoliyat turi"
              value={data?.activityType ? tabs?.find((i) => i?.key == data?.activityType)?.label : '-'}
            />
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="auto" title="Avtotransport vositasi haqida">
            <DetailRow title="Davlat raqami belgisi" value={data?.numberPlate || '-'} />
            <DetailRow title="Avtotransport vositasi modeli" value={data?.model || '-'} />
            <DetailRow title="Sig‘imning zavod raqami" value={data?.factoryNumber || '-'} />
            <DetailRow title="Sig‘imning ro‘yxat yoki inventarizatsiya raqami" value={data?.inventoryNumber || '-'} />
            <DetailRow title="Sig‘imning hajmi" value={data?.capacity || '-'} />
            <DetailRow title="Sig‘im hajmining o‘lchov birligi" value={data?.capacityUnit || '-'} />
            <DetailRow
              title="Texnik ko‘rik o‘tkazilgan sana"
              value={data?.checkDate ? formatDate(data?.checkDate, 'dd.MM.yyyy') : '-'}
            />
            <DetailRow
              title="Texnik ko‘rik amal qilish muddati"
              value={data?.validUntil ? formatDate(data?.validUntil, 'dd.MM.yyyy') : '-'}
            />
          </DetailCardAccordion.Item>
        </DetailCardAccordion>
      </div>
    </div>
  )
}
