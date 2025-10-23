import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail.tsx';
import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import FileLink from '@/shared/components/common/file-link.tsx';
import { Coordinate } from '@/shared/components/common/yandex-map';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx';
//import { useDetail } from '@/shared/hooks';
import { getDate } from '@/shared/utils/date.ts';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/use-auth';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { QRCodeCanvas } from 'qrcode.react';
import { EquipmentPdfDocument } from '@/shared/components/common/EquipmentPdfDocument';
import { useState, useEffect } from 'react';
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx';
import { EquipmentStickerPdf } from '@/shared/components/common/EquipmentStickerPdf';

const EquipmentsDetail = () => {
  const { isLoading, data } = useEquipmentsDetail();
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[]);
  const { user } = useAuth();
  const { id: equipmentUuid } = useParams<{ id: string }>();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const { data: legalData } = useLegalApplicantInfo(data?.ownerIdentity);

  useEffect(() => {
    console.log('useEffect ishga tushdi, data mavjud:', !!data);
    const canvas = document.getElementById('pdf-qr-canvas') as HTMLCanvasElement;
    console.log('Canvas elementi topildimi?:', canvas); // ENG MUHIM QATOR
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setQrCodeDataUrl(dataUrl);
      console.log("QR-kod Data URL o'rnatildi.");
    }
  }, [data]);

  /*  const { data: regNumber } = useDetail<any>(
    '/equipments/registry-number',
    data?.registryNumber,
    !!data?.registryNumber,
  ); */
  if (isLoading || !data) {
    return null;
  }

  const equipmentPublicUrl = `${window.location.origin}/qr/${equipmentUuid}/equipments`;

  const handleQrCanvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setQrCodeDataUrl(dataUrl);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
      </div>
      <DetailCardAccordion
        defaultValue={[
          'registry_info',
          'applicant_info',
          'applicant_info_individual',
          'object_info',
          'object_location',
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
            <div className="py-1  flex flex-col">
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
          {/*<FilesSection files={data?.files || []} />*/}
          <FilesSection
            appealId={data?.appealId}
            userRole={user?.role}
            register={true}
            url="equipments"
            files={data?.files || []}
          />
        </DetailCardAccordion.Item>

        {data?.type == 'ATTRACTION' ? (
          <DetailCardAccordion.Item value="object_qr" title="Qurilma pasport ma‘lumotlari">
            {/* YASHIRIN CANVAS (O'ZGARISHSIZ) */}
            <QRCodeCanvas
              id="pdf-qr-canvas" // ID endi shart emas, lekin qoldirsa bo'ladi
              value={equipmentPublicUrl}
              size={256}
              style={{ display: 'none' }}
              ref={handleQrCanvasRef} // <--- ENG MUHIM O'ZGARISH
            />

            <div className="flex items-center p-4 space-x-8">
              <div className="flex-shrink-0">
                {' '}
                {/* Bu qism kichraymaydi */}
                <QRCodeCanvas
                  value={equipmentPublicUrl}
                  size={128} // O'lchamini kichraytirdik
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'L'}
                  includeMargin={false}
                />
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
                              attractionName: data.attractionName, // API'da shu nom bo'lishi kerak
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
                            <span className="text-[#0271FF] cursor-pointer hover:underline">Chop etish</span>
                          )
                        }
                      </PDFDownloadLink>
                    ) : (
                      <span>QR kod tayyorlanmoqda...</span>
                    )
                  }
                />

                {/* "PDF FORMATIDA" QATORINING TO'LIQ KODI */}
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
                            <span className="text-[#0271FF] cursor-pointer hover:underline">Yuklab olish</span>
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
        ) : null}

        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
      </DetailCardAccordion>
    </div>
  );
};

export default EquipmentsDetail;
