import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import {
  MultiCategoryFiles,
  multiCategoryFileValue,
} from '@/features/application/application-detail/ui/parts/multi-category-files'
import { RefreshLegalInfoButton } from '@/features/application/application-detail/ui/parts/refresh-legal-info-button.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useHfDetail } from '@/features/register/hf/hooks/use-hf-detail.tsx'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { Logs } from '@/features/register/hf/ui/parts/logs'
import { useState } from 'react'
import { UserRoles } from '@/entities/user'
import { Button } from '@/shared/components/ui/button'
import { DeregisterModal } from '../../common/ui/deregister-modal'
import { ChangeStatusModal } from '../../common/ui/change-status-modal'
import { Badge } from '@/shared/components/ui/badge'
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list'
import CadastreList from '@/features/cadastre-passport/ui/cadastre-list'
import { EmptyValue } from '@/shared/components/common/empty-value'

const HfDetail = () => {
  const renderStatus = (status: string | null | undefined) => {
    switch (status) {
      case 'VALID':
      case 'ACTIVE':
        return <Badge variant="success">Faol</Badge>
      case 'INVALID':
        return <Badge variant="error">Vaqtinchalik nofaol</Badge>
      case 'INACTIVE':
        return <Badge variant="error">Reyestrdan chiqarilgan</Badge>
      default:
        return <span>{status || 'Mavjud emas'}</span>
    }
  }
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { isLoading, data, refetch } = useHfDetail()
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[])

  const multiCategoryFiles: Record<string, any[]> = data?.multiCategoryFiles || {}
  const multiCategoryIds = Object.keys(multiCategoryFiles)

  /**
   * The heavy sections are closed to start with and their content is not
   * mounted until they are opened, so a visit costs one request instead of
   * three - the equipment list and the cadastre list each fetch their own page.
   */
  const [openSections, setOpenSections] = useState<string[]>([
    'registry_info',
    'object_info',
    'object_files',
    ...multiCategoryIds.map(multiCategoryFileValue),
  ])

  const isOpen = (section: string) => openSections.includes(section)
  const { user } = useAuth()

  const [isDeregisterModalOpen, setIsDeregisterModalOpen] = useState(false)
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false)

  const statusParam = searchParams.get('status')
  const currentStatus = data?.status || statusParam
  const isRegistryActive = data?.active ?? searchParams.get('active') === 'true'
  const canAction = user?.role === UserRoles.INSPECTOR && isRegistryActive

  if (isLoading || !data) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
        <div className="flex gap-2">
          {canAction && (
            <>
              <Button variant="warning" onClick={() => setIsChangeStatusModalOpen(true)}>
                {currentStatus === 'INVALID' ? 'Faolga o‘tkazish' : 'Vaqtinchalik nofaolga o‘tkazish'}
              </Button>
              <Button variant="destructiveOutline" onClick={() => setIsDeregisterModalOpen(true)}>
                Reyestrdan chiqarish
              </Button>
            </>
          )}
        </div>
      </div>

      <DeregisterModal
        isOpen={isDeregisterModalOpen}
        onClose={() => setIsDeregisterModalOpen(false)}
        endpoint={`/hf/${id}/deregister`}
        onSuccess={refetch}
      />
      <ChangeStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        endpoint={`/hf/${id}/change-status`}
        onSuccess={refetch}
        targetStatus={currentStatus === 'INVALID' ? 'VALID' : 'INVALID'}
        type="HF"
      />

      <DetailCardAccordion value={openSections} onValueChange={setOpenSections}>
        <DetailCardAccordion.Item
          value="applicant_info"
          title="Arizachi to‘g‘risida ma’lumot"
          action={
            user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL ? (
              <RefreshLegalInfoButton tinNumber={data?.legalTin} />
            ) : null
          }
        >
          <LegalApplicantInfo tinNumber={data?.legalTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
          {user?.role !== UserRoles.PROCURATOR && (
            <DetailRow
              title="Reyestrga kiritish uchun asos (ariza):"
              value={
                data?.appealId ? (
                  <Link className="text-[#0271FF]" to={'/applications/detail/' + data?.appealId}>
                    Arizani ko‘rish
                  </Link>
                ) : (
                  <EmptyValue />
                )
              }
            />
          )}

          <DetailRow title="Holati:" value={renderStatus(currentStatus)} />

          <DetailRow
            title="Roʻyxatga olish sanasi:"
            value={data?.registrationDate ? getDate(data?.registrationDate) : <EmptyValue />}
          />

          <DetailRow
            title="Roʻyxatga olish raqami:"
            value={data?.registryNumber ? data?.registryNumber : <EmptyValue />}
          />

          <DetailRow
            title="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat:"
            value={data?.registryFilePath ? <FileLink url={data?.registryFilePath} /> : <EmptyValue />}
          />

          {!data?.active && (
            <>
              <DetailRow
                title="Reyestrdan chiqarish sanasi:"
                value={data?.deactivationDate ? getDate(data?.deactivationDate) : <EmptyValue />}
              />

              <DetailRow
                title="Reyestrdan chiqarilganligi to‘g‘risidagi hujjat:"
                value={data?.deregisterFilePath ? <FileLink url={data?.deregisterFilePath} /> : <EmptyValue />}
              />

              <DetailRow
                title="Reyestrdan chiqarish uchun asos:"
                value={data?.deregisterBasisPath ? <FileLink url={data?.deregisterBasisPath} /> : <EmptyValue />}
              />

              <DetailRow
                title="Reyestrdan chiqarish sababi:"
                value={data?.deregisterReason ? data?.deregisterReason : <EmptyValue />}
              />
            </>
          )}
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={'HF'} address={data?.address} showStaffCounts />
        </DetailCardAccordion.Item>
        {/* A multi-sector facility keeps one attachment set per category. */}
        {multiCategoryIds.length > 0 ? (
          <MultiCategoryFiles
            multiCategoryFiles={multiCategoryFiles}
            appealId={data?.appealId}
            userRole={user?.role}
            register
          />
        ) : (
          <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
            <FilesSection appealId={data?.appealId} userRole={user?.role} register={true} files={data?.files || []} />
          </DetailCardAccordion.Item>
        )}
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            {isOpen('object_location') && (
              <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
            )}
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="attached_equipments" title="Biriktirilgan qurilmalar">
          {isOpen('attached_equipments') && <EquipmentsList hfId={id} hideTabs={true} isShortView={true} />}
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="cadastre_passports" title="TXYZ kadastr">
          {isOpen('cadastre_passports') && <CadastreList customerTin={data?.legalTin} isShortView />}
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="history" title="O‘zgartirishlar tarixi">
          {isOpen('history') && <Logs />}
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default HfDetail
