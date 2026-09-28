import { Link, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import useDetail from '@/shared/hooks/api/use-detail'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { getDate } from '@/shared/utils/date'
import FileLink from '@/shared/components/common/file-link'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { ApplicationStatusBadge } from '@/entities/application/ui/application-status-badge'
import { ApplicationStatus } from '@/entities/application'
import type { DeclarationDetail as DeclarationDetailData } from '@/entities/declarations/model/declaration.types'

interface DeclarationDetailProps {
  detailData?: DeclarationDetailData
}

export const DeclarationDetail = ({ detailData }: DeclarationDetailProps) => {
  const { id } = useParams()
  const { detail: fetchedDetail, isFetching } = useDetail<DeclarationDetailData>(
    '/declarations',
    id,
    !detailData && !!id
  )

  const detail = detailData || fetchedDetail

  if (isFetching && !detail) {
    return (
      <div className="mt-4">
        <DetailPageSkeleton sections={3} />
      </div>
    )
  }

  if (!detail) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Ma’lumotlar topilmadi</p>
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
          <LegalApplicantInfo tinNumber={detail?.expertTin || detail?.customerTin} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="declaration_info" title="Deklaratsiya to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Deklaratsiya ro‘yxat raqami:" value={detail?.registryNumber} />
            <DetailRow title="Ekspertiza xulosasi reyestr raqami:" value={detail?.conclusionRegistryNumber || '-'} />
            <DetailRow title="Yaratilgan sana:" value={detail?.createdAt ? getDate(detail?.createdAt) : '-'} />
            <DetailRow
              title="Holat:"
              value={detail.status ? <ApplicationStatusBadge status={ApplicationStatus[detail.status]} /> : '-'}
            />
            <DetailRow
              title="XICHOlar:"
              value={
                <div className="flex flex-col gap-1">
                  {detail.hfIds?.length
                    ? detail.hfIds.map((hfId, index) => (
                        <div key={hfId}>
                          <Link to={`/register/hf/${hfId}`} className="font-medium text-blue-600">
                            XICHO {index + 1}
                          </Link>
                        </div>
                      ))
                    : '-'}
                </div>
              }
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
              value={detail?.registryFilePath ? <FileLink url={detail?.registryFilePath} /> : null}
            />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
