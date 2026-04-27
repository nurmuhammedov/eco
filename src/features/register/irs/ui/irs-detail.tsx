import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useIrsDetail } from '@/features/register/irs/hooks/use-irs-detail.tsx'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { Link } from 'react-router-dom'
import { Logs } from '@/features/register/hf/ui/parts/logs'

const IrsDetail = () => {
  const { isLoading, data } = useIrsDetail()
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[])

  if (isLoading || !data) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
      </div>
      <DetailCardAccordion
        defaultValue={['registry_info', 'applicant_info', 'object_info', 'object_location', 'object_files']}
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

          {/*<DetailRow*/}
          {/*  title="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat:"*/}
          {/*  value={*/}
          {/*    data?.registryFilePath ? (*/}
          {/*      <FileLink url={data?.registryFilePath} />*/}
          {/*    ) : (*/}
          {/*      <span className="text-red-600">Mavjud emas</span>*/}
          {/*    )*/}
          {/*  }*/}
          {/*/>*/}

          {!data?.isValid && (
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

              {/*<DetailRow*/}
              {/*  title="Reyestrdan chiqarilganligi to‘g‘risidagi hujjat:"*/}
              {/*  value={*/}
              {/*    data?.deregisterFilePath ? (*/}
              {/*      <FileLink url={data?.deregisterFilePath} />*/}
              {/*    ) : (*/}
              {/*      <span className="text-red-600">Mavjud emas</span>*/}
              {/*    )*/}
              {/*  }*/}
              {/*/>*/}

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
          <LegalApplicantInfo showUpdateButton={true} tinNumber={data?.legalTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={'IRS'} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          <FilesSection files={data?.files || []} />
        </DetailCardAccordion.Item>
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="history" title="O‘zgartirishlar tarixi">
          <Logs url="irs" />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default IrsDetail
