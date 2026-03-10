import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import useDetail from '@/shared/hooks/api/useDetail'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { getDate } from '@/shared/utils/date'
import FileLink from '@/shared/components/common/file-link'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { ApplicationStatusBadge } from '@/entities/application/ui/application-status-badge'

interface DeclarationDetailProps {
  detailData?: any
}

export const DeclarationDetail = ({ detailData }: DeclarationDetailProps) => {
  const { id } = useParams()
  const { detail: fetchedDetail, isFetching } = useDetail<any>('/declarations', id, !detailData && !!id)

  const detail = detailData || fetchedDetail

  if (isFetching && !detail) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Yuklanmoqda...</p>
        </CardContent>
      </Card>
    )
  }

  if (!detail) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <DetailCardAccordion defaultValue={['customer_org', 'legal_org', 'object_info', 'declaration_info']}>
        <DetailCardAccordion.Item value="customer_org" title="Tashkilot to‘g‘risida ma’lumot">
          <LegalApplicantInfo tinNumber={detail?.customerTin} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="legal_org" title="Deklaratsiya ishlab chiquvchi tashkilot">
          <LegalApplicantInfo tinNumber={detail?.expertTin} />
        </DetailCardAccordion.Item>

        {/*<DetailCardAccordion.Item value="object_info" title="XICHOlar to‘g‘risida ma’lumot">*/}
        {/*  <div className="flex flex-col py-1">*/}
        {/*    <DetailRow*/}
        {/*      title="XICHOlar reyestr raqamlari:"*/}
        {/*      value={detail?.hfRegistryNumbers && detail.hfRegistryNumbers.length > 0 ? detail.hfRegistryNumbers.join(', ') : '-'}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</DetailCardAccordion.Item>*/}

        <DetailCardAccordion.Item value="declaration_info" title="Deklaratsiya to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Deklaratsiya ro‘yxat raqami:" value={detail?.registryNumber || '-'} />
            <DetailRow title="Ekspertiza xulosasi reyestr raqami:" value={detail?.conclusionRegistryNumber || '-'} />
            <DetailRow title="Yaratilgan sana:" value={detail?.createdAt ? getDate(detail?.createdAt) : '-'} />
            <DetailRow
              title="Holat:"
              value={detail?.status ? <ApplicationStatusBadge status={detail.status} /> : '-'}
            />
            <DetailRow
              title="Deklaratsiya fayli:"
              value={detail?.declarationPath ? <FileLink url={detail?.declarationPath} /> : '-'}
            />
            <DetailRow
              title="Axborotnoma fayli:"
              value={detail?.infoLetterPath ? <FileLink url={detail?.infoLetterPath} /> : '-'}
            />
            <DetailRow
              title="Hisob-kitob tushuntirish xati:"
              value={detail?.explanatoryNotePath ? <FileLink url={detail?.explanatoryNotePath} /> : '-'}
            />
            <DetailRow
              title="Reyestr fayli:"
              value={detail?.registryFilePath ? <FileLink url={detail?.registryFilePath} /> : '-'}
            />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
