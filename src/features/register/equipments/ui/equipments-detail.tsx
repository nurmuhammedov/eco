const EquipmentPdfLinks = lazy(() => import('@/features/register/equipments/ui/parts/equipment-pdf-links'))
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section'
import { RefreshLegalInfoButton } from '@/features/application/application-detail/ui/parts/refresh-legal-info-button'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import FileLink from '@/shared/components/common/file-link'
import { parseCoordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map'
import { getDate } from '@/shared/utils/date'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { QRCodeCanvas } from 'qrcode.react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { Button } from '@/shared/components/ui/button'
import { UserRoles } from '@/shared/types/user'
import { Logs } from '@/features/register/hf/ui/parts/logs'
import { DeregisterModal } from '../../common/ui/deregister-modal'
import { ChangeStatusModal } from '../../common/ui/change-status-modal'
import { RestoreModal } from '../../common/ui/restore-modal'
import { useLastChange } from '../../common/model/use-last-change'
import { Badge } from '@/shared/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { SafeHtml } from '@/shared/components/common/safe-html'
import { EmptyValue } from '@/shared/components/common/empty-value'
const EquipmentsDetail = () => {
  const renderStatus = (status: string | null | undefined) => {
    switch (status) {
      case 'VALID':
      case 'ACTIVE':
        return <Badge variant="success">Soz</Badge>
      case 'INVALID':
        return <Badge variant="error">Vaqtinchalik nosoz</Badge>
      case 'INACTIVE':
        return <Badge variant="error">Reyestrdan chiqarilgan</Badge>
      case 'EXPIRED':
        return <Badge variant="warning">Muddati o‘tgan</Badge>
      case 'NO_DATE':
        return <Badge variant="warning">Muddati kiritilmagan</Badge>
      default:
        return <span>{status || 'Mavjud emas'}</span>
    }
  }
  const { isLoading, data, refetch } = useEquipmentsDetail()
  const objectPoint = parseCoordinate(data?.location)
  const { user } = useAuth()
  const { id: equipmentUuid } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const { data: legalData } = useLegalOrganizationQuery(data?.ownerIdentity)
  const navigate = useNavigate()

  const [isDeregisterModalOpen, setIsDeregisterModalOpen] = useState(false)
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false)

  const statusParam = searchParams.get('status')
  const currentStatus = data?.status || statusParam
  const isRegistryActive = data?.isActive ?? searchParams.get('active') === 'true'
  const canAction = user?.role === UserRoles.INSPECTOR && isRegistryActive

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const isDeregistered = data?.isActive === false && data?.status === 'INACTIVE'
  // SUPERVISOR is folded into REGIONAL on sign-in, so this covers both senders
  const isRegional = user?.role === UserRoles.REGIONAL
  const isManager = user?.role === UserRoles.MANAGER
  const { lastChange, isResolved, restoreInApproval, restoreReturned, hasOpenChange } = useLastChange(
    equipmentUuid,
    isDeregistered && (isRegional || isManager)
  )
  // The backend refuses a REGIONAL another region's object; a supervisor's scope is the inspection, left to the backend
  const isInOwnScope = !!user?.isSupervisor || Number(data?.regionId) === user?.regionId
  const canRestore = isRegional && isInOwnScope && isDeregistered && isResolved && !hasOpenChange
  const canResubmit = isRegional && isInOwnScope && isDeregistered && restoreReturned

  useEffect(() => {
    const canvas = document.getElementById('pdf-qr-canvas') as HTMLCanvasElement
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      setQrCodeDataUrl(dataUrl)
    }
  }, [data])

  if (isLoading) return <DetailPageSkeleton />
  if (!data) return null
  const equipmentPublicUrl = `${window.location.origin}/qr/${equipmentUuid}/equipments`

  const handleQrCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      setQrCodeDataUrl(dataUrl)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
        <div className="flex gap-2">
          {canAction && (
            <>
              <Button variant="warning" onClick={() => setIsChangeStatusModalOpen(true)}>
                {currentStatus === 'INVALID' ? 'Sozga o‘tkazish' : 'Vaqtinchalik nosozga o‘tkazish'}
              </Button>
              <Button variant="destructiveOutline" onClick={() => setIsDeregisterModalOpen(true)}>
                Reyestrdan chiqarish
              </Button>
            </>
          )}
          {canRestore && (
            <Button variant="success" onClick={() => setIsRestoreModalOpen(true)}>
              Reyestrga qaytarish
            </Button>
          )}
          {canResubmit && (
            <Button variant="success" onClick={() => setIsRestoreModalOpen(true)}>
              Qayta yuborish
            </Button>
          )}
          {isRegional && isDeregistered && restoreInApproval && (
            <Badge variant="info" className="py-2">
              Reyestrga qaytarish so‘rovi tasdiqlashda
            </Badge>
          )}
          {(isRegional || isManager) && isDeregistered && restoreInApproval && (
            <Button asChild variant={isManager ? 'info' : 'outline'}>
              <Link to={`/register/change/equipments/${equipmentUuid}`}>So‘rovni ko‘rish</Link>
            </Button>
          )}
          {user?.role === UserRoles.CHAIRMAN && (
            <Button onClick={() => navigate(`/register/equipments/${equipmentUuid}/appeals`)}>Murojaatlar</Button>
          )}
        </div>
      </div>

      <DeregisterModal
        isOpen={isDeregisterModalOpen}
        onClose={() => setIsDeregisterModalOpen(false)}
        endpoint={`/equipments/${equipmentUuid}/deregister`}
        onSuccess={refetch}
      />
      <ChangeStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        endpoint={`/equipments/${equipmentUuid}/change-status`}
        onSuccess={refetch}
        targetStatus={currentStatus === 'INVALID' ? 'VALID' : 'INVALID'}
      />
      <RestoreModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        endpoint={`/equipments/${equipmentUuid}/restore`}
        onSuccess={refetch}
        isResubmit={restoreReturned}
      />
      {canResubmit && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Reyestrga qaytarish so‘rovi qaytarildi</AlertTitle>
          <AlertDescription>
            <SafeHtml html={lastChange?.description} fallback="-" className="break-words" />
          </AlertDescription>
        </Alert>
      )}
      <DetailCardAccordion
        defaultValue={['registry_info', 'object_info', 'object_location', 'object_qr', 'object_files']}
      >
        {data?.ownerType != 'LEGAL' ? (
          <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow title="Arizachi F.I.SH.:" value={legalData?.name || '-'} />
              <DetailRow title="Arizachi JSHSHIR:" value={legalData?.identity || '-'} />
            </div>
          </DetailCardAccordion.Item>
        ) : (
          <DetailCardAccordion.Item
            value="applicant_info"
            title="Arizachi to‘g‘risida ma’lumot"
            action={
              user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL ? (
                <RefreshLegalInfoButton tinNumber={data?.ownerIdentity} />
              ) : null
            }
          >
            <LegalApplicantInfo tinNumber={data?.ownerIdentity} />
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
          {user?.role !== UserRoles.PROCURATOR && (
            <DetailRow
              title="Reyestrga kiritish uchun asos (ariza):"
              value={
                data?.appealId ? (
                  <Link className="text-[#0271FF]" to={'/applications/' + data?.appealId}>
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
            title="Ro‘yxatga olish sanasi:"
            value={data?.registrationDate ? getDate(data?.registrationDate) : <EmptyValue />}
          />

          <DetailRow
            title="Ro‘yxatga olish raqami:"
            value={data?.registryNumber ? data?.registryNumber : <EmptyValue />}
          />

          <DetailRow
            title="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat:"
            value={data?.registryFilePath ? <FileLink url={data?.registryFilePath} /> : <EmptyValue />}
          />

          {!data?.isActive && (
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
          <AppealMainInfo
            trainedEmployeesTin={data?.ownerIdentity}
            data={data}
            type={data?.type}
            address={data?.address}
          />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          <FilesSection
            appealId={data?.appealId}
            userRole={user?.role}
            register={true}
            url="equipments"
            files={data?.files || []}
          />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_qr" title="Qurilma pasport ma’lumotlari">
          <QRCodeCanvas
            id="pdf-qr-canvas"
            value={equipmentPublicUrl}
            size={256}
            style={{ display: 'none' }}
            ref={handleQrCanvasRef}
          />

          <div className="flex items-center space-x-8 p-4">
            <div className="flex-shrink-0">
              <QRCodeCanvas value={equipmentPublicUrl} size={128} bgColor={'#ffffff'} fgColor={'#000000'} level={'L'} />
            </div>
            <div className="flex-grow">
              {qrCodeDataUrl ? (
                <Suspense fallback={<span className="text-sm text-neutral-500">Tayyorlanmoqda...</span>}>
                  <EquipmentPdfLinks
                    data={{
                      ownerName: legalData?.name || data?.ownerName,
                      registryNumber: data.registryNumber,
                      registrationDate: data.registrationDate,
                      attractionName: data.attractionName,
                      qrCodeDataUrl,
                    }}
                  />
                </Suspense>
              ) : (
                <span>QR kod tayyorlanmoqda...</span>
              )}
            </div>
          </div>
        </DetailCardAccordion.Item>

        {objectPoint && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[objectPoint]} center={objectPoint} zoom={16} />
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="history" title="O‘zgartirishlar tarixi">
          <Logs url="equipments" />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default EquipmentsDetail
