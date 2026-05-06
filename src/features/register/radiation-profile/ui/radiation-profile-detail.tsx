import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useAuth } from '@/shared/hooks/use-auth'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import { useParams, useSearchParams } from 'react-router-dom'
import { useData } from '@/shared/hooks'
import { IrsList } from '@/features/register/irs/ui/irs-list'
import { XrayList } from '@/features/register/xray/ui/xray-list'
import { useTranslation } from 'react-i18next'
import { UserRoles } from '@/entities/user'

export const RadiationProfileDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const { t } = useTranslation()

  const { data, isLoading } = useData<any>(`/radiation-profiles/${id}`)

  const formattedFiles = data?.files
    ? Object.entries(data.files)
        .filter(([label]) => label.includes('Path'))
        .map(([key, val]) => ({
          label: t(`labels.${type || 'XRAY'}.${key}`),
          data: val as any,
          fieldName: key,
        }))
    : []

  if (isLoading) return null

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Tashkilot ma'lumotlari`} />
      </div>

      <DetailCardAccordion defaultValue={['applicant_info', 'object_files', 'devices']}>
        <DetailCardAccordion.Item value="applicant_info" title="Tashkilot to‘g‘risida ma’lumot">
          <LegalApplicantInfo
            showUpdateButton={user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL}
            tinNumber={data?.legalTin}
          />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_files" title="Tashkilotga biriktirilgan fayllar">
          <FilesSection files={formattedFiles} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="devices"
          title={type === 'IRS' ? 'Ioniqlashtiruvchi nurlanish manbalari' : 'Rentgen qurilmalari'}
        >
          {type === 'IRS' ? (
            <IrsList radiationProfileId={id} isArchive={false} hideTabs={true} />
          ) : (
            <XrayList radiationProfileId={id} isArchive={false} hideTabs={true} />
          )}
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default RadiationProfileDetail
