import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail.tsx'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { QRCodeCanvas } from 'qrcode.react'
import { EquipmentPdfDocument } from '@/shared/components/common/equipment-pdf-document'
import { useEffect, useState } from 'react'
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx'
import { EquipmentStickerPdf } from '@/shared/components/common/equipment-sticker-pdf'

const EquipmentsDetail = () => {
  const { isLoading, data } = useEquipmentsDetail()
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[])
  const { user } = useAuth()
  const { id: equipmentUuid } = useParams<{ id: string }>()
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const { data: legalData } = useLegalApplicantInfo(data?.ownerIdentity)

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
      </div>
      <DetailCardAccordion
        defaultValue={[
          'registry_info',
          'applicant_info',
          'applicant_info_individual',
          'object_info',
          'object_location',
          'object_qr',
          'object_files',
        ]}
      >
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
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
          <DetailRow title="Hisobga olish sanasi:" value={getDate(data?.registrationDate)} />
          <DetailRow title="Hisobga olish raqami:" value={data?.registryNumber} />
          <DetailRow title="Qurilmaning eski hisobga olish raqami:" value={data?.oldRegistryNumber || '-'} />
          {!!data?.registryFilePath && (
            <DetailRow title="Sertifikat fayli:" value={<FileLink url={data?.registryFilePath} />} />
          )}
          <DetailRow title="Reyestrdan chiqarish sanasi:" value={getDate(data?.deregisterDate)} />
          <DetailRow title="Reyestrdan chiqarish sababi:" value={getDate(data?.deregisterReason)} />
        </DetailCardAccordion.Item>
        {data?.ownerType != 'LEGAL' ? (
          <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow title="Arizachi JSHIR:" value={data?.ownerIdentity || '-'} />
              <DetailRow title="Arizachi F.I.SH:" value={data?.ownerName || '-'} />
              <DetailRow title="Arizachining manzili:" value={data?.address || '-'} />
              <DetailRow title="Arizachining telefon raqami:" value={data?.phoneNumber || '-'} />
            </div>
          </DetailCardAccordion.Item>
        ) : (
          <DetailCardAccordion.Item value="applicant_info" title="Arizachi to‘g‘risida ma’lumot">
            <LegalApplicantInfo tinNumber={data?.ownerIdentity} />
          </DetailCardAccordion.Item>
        )}
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
      </DetailCardAccordion>
    </div>
  )
}

export default EquipmentsDetail
