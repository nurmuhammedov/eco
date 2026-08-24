import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import { RefreshLegalInfoButton } from '@/features/application/application-detail/ui/parts/refresh-legal-info-button.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail.tsx'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { QRCodeCanvas } from 'qrcode.react'
import { EquipmentPdfDocument } from '@/shared/components/common/equipment-pdf-document'
import { useEffect, useState } from 'react'
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx'
import { EquipmentStickerPdf } from '@/shared/components/common/equipment-sticker-pdf'
import { Button } from '@/shared/components/ui/button'
import { UserRoles } from '@/entities/user'
import { Logs } from '@/features/register/hf/ui/parts/logs'
import { DeregisterModal } from '../../common/ui/deregister-modal'
import { ChangeStatusModal } from '../../common/ui/change-status-modal'
import { Badge } from '@/shared/components/ui/badge'
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
  const currentObjLocation = data?.location?.split(',').map(Number) || ([] as Coordinate[])
  const { user } = useAuth()
  const { id: equipmentUuid } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const { data: legalData } = useLegalApplicantInfo(data?.ownerIdentity)
  const navigate = useNavigate()

  const [isDeregisterModalOpen, setIsDeregisterModalOpen] = useState(false)
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false)

  const statusParam = searchParams.get('status')
  const currentStatus = data?.status || statusParam
  const isRegistryActive = data?.isActive ?? searchParams.get('active') === 'true'
  const canAction = user?.role === UserRoles.INSPECTOR && isRegistryActive

  useEffect(() => {
    const canvas = document.getElementById('pdf-qr-canvas') as HTMLCanvasElement
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      setQrCodeDataUrl(dataUrl)
    }
  }, [data])

  if (isLoading || !data) {
    return null
  }
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
          {user?.role === UserRoles.CHAIRMAN && (
            <Button onClick={() => navigate(`/register/${equipmentUuid}/equipments/appeals`)}>Murojaatlar</Button>
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
          <AppealMainInfo data={data} type={data?.type} address={data?.address} />
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

        <DetailCardAccordion.Item value="object_qr" title="Qurilma pasport ma‘lumotlari">
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
              <DetailRow
                title="QR Etiketka shaklida 100x40:"
                value={
                  qrCodeDataUrl ? (
                    <PDFDownloadLink
                      document={
                        <EquipmentStickerPdf
                          data={{
                            ownerName: legalData?.name || data?.ownerName,
                            registryNumber: data.registryNumber,
                            registrationDate: data.registrationDate,
                            attractionName: data.attractionName,
                            qrCodeDataUrl: qrCodeDataUrl,
                          }}
                        />
                      }
                      fileName={`etiketka-${data.registryNumber}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          'Tayyorlanmoqda...'
                        ) : (
                          <span className="cursor-pointer text-[#0271FF] hover:underline">Chop etish</span>
                        )
                      }
                    </PDFDownloadLink>
                  ) : (
                    <span>QR kod tayyorlanmoqda...</span>
                  )
                }
              />

              <DetailRow
                title="PDF A5 formatida:"
                value={
                  qrCodeDataUrl ? (
                    <PDFDownloadLink
                      document={
                        <EquipmentPdfDocument
                          data={{
                            ownerName: legalData?.name || data?.ownerName,
                            registryNumber: data.registryNumber,
                            registrationDate: data.registrationDate,
                            attractionName: data.attractionName,
                            qrCodeDataUrl: qrCodeDataUrl,
                          }}
                        />
                      }
                      fileName={`passport-${data.registryNumber}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          'Tayyorlanmoqda...'
                        ) : (
                          <span className="cursor-pointer text-[#0271FF] hover:underline">Yuklab olish</span>
                        )
                      }
                    </PDFDownloadLink>
                  ) : (
                    <span>QR kod generatsiya qilinmoqda...</span>
                  )
                }
              />
            </div>
          </div>
        </DetailCardAccordion.Item>

        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
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
