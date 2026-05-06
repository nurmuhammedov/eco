import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
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
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list'

const HfDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { isLoading, data, refetch } = useHfDetail()
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[])
  const { user } = useAuth()

  const [isDeregisterModalOpen, setIsDeregisterModalOpen] = useState(false)

  const isActive = searchParams.get('active') === 'true'
  const canDeregister = user?.role === UserRoles.INSPECTOR && isActive

  if (isLoading || !data) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
        {canDeregister && (
          <Button variant="destructiveOutline" onClick={() => setIsDeregisterModalOpen(true)}>
            Reyestrdan chiqarish
          </Button>
        )}
      </div>

      <DeregisterModal
        isOpen={isDeregisterModalOpen}
        onClose={() => setIsDeregisterModalOpen(false)}
        endpoint={`/hf/${id}/deregister`}
        onSuccess={refetch}
      />
      <DetailCardAccordion
        defaultValue={[
          'registry_info',
          'applicant_info',
          'object_info',
          'object_location',
          'object_files',
          'attached_equipments',
        ]}
      >
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
                  <span className="text-red-600">Mavjud emas</span>
                )
              }
            />
          )}

          <DetailRow
            title="Roʻyxatga olish sanasi:"
            value={
              data?.registrationDate ? (
                getDate(data?.registrationDate)
              ) : (
                <span className="text-red-600">Mavjud emas</span>
              )
            }
          />

          <DetailRow
            title="Roʻyxatga olish raqami:"
            value={data?.registryNumber ? data?.registryNumber : <span className="text-red-600">Mavjud emas</span>}
          />

          <DetailRow
            title="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat:"
            value={
              data?.registryFilePath ? (
                <FileLink url={data?.registryFilePath} />
              ) : (
                <span className="text-red-600">Mavjud emas</span>
              )
            }
          />

          {!data?.active && (
            <>
              <DetailRow
                title="Reyestrdan chiqarish sanasi:"
                value={
                  data?.deactivationDate ? (
                    getDate(data?.deactivationDate)
                  ) : (
                    <span className="text-red-600">Mavjud emas</span>
                  )
                }
              />

              <DetailRow
                title="Reyestrdan chiqarilganligi to‘g‘risidagi hujjat:"
                value={
                  data?.deregisterFilePath ? (
                    <FileLink url={data?.deregisterFilePath} />
                  ) : (
                    <span className="text-red-600">Mavjud emas</span>
                  )
                }
              />

              <DetailRow
                title="Reyestrdan chiqarish uchun asos:"
                value={
                  data?.deregisterBasisPath ? (
                    <FileLink url={data?.deregisterBasisPath} />
                  ) : (
                    <span className="text-red-600">Mavjud emas</span>
                  )
                }
              />

              <DetailRow
                title="Reyestrdan chiqarish sababi:"
                value={
                  data?.deregisterReason ? data?.deregisterReason : <span className="text-red-600">Mavjud emas</span>
                }
              />
            </>
          )}
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="applicant_info" title="Arizachi to‘g‘risida ma’lumot">
          <LegalApplicantInfo
            showUpdateButton={user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL}
            tinNumber={data?.legalTin}
          />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={'HF'} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          <FilesSection appealId={data?.appealId} userRole={user?.role} register={true} files={data?.files || []} />
        </DetailCardAccordion.Item>
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="attached_equipments" title="Biriktirilgan qurilmalar">
          <EquipmentsList hfId={id} hideTabs={true} isShortView={true} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="history" title="O‘zgartirishlar tarixi">
          <Logs />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default HfDetail
