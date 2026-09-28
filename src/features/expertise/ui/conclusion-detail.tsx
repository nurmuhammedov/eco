import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import useDetail from '@/shared/hooks/api/use-detail'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { ExpertiseTypeEnum, ExpertiseTypeOptions } from '@/entities/expertise/model/constants'
import { getDate } from '@/shared/utils/date'
import { Badge } from '@/shared/components/ui/badge'
import FileLink from '@/shared/components/common/file-link'
import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import type { ConclusionDetail as ConclusionDetailData } from '@/entities/expertise/model/conclusion.types'

interface ConclusionDetailProps {
  /** A declaration brought over from paper also carries the declaration's own number and date */
  isOld?: boolean
}

export const ConclusionDetail = ({ isOld }: ConclusionDetailProps) => {
  const { id } = useParams()

  const { detail, isFetching } = useDetail<ConclusionDetailData>('/conclusions', id, !!id)
  const { detail: legalData, isFetching: fetchingData } = useLegalOrganizationQuery(detail?.legalTin)
  const { detail: customerData, isFetching: fetchingCustomerData } = useLegalOrganizationQuery(detail?.customerTin)

  if (isFetching || fetchingData || fetchingCustomerData) {
    return (
      <div className="mt-4">
        <DetailPageSkeleton sections={4} />
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
    <div className="mt-4">
      <DetailCardAccordion defaultValue={['expert_org', 'customer_org', 'object_info', 'conclusion_info']}>
        <DetailCardAccordion.Item value="expert_org" title="Ekspert tashkiloti to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Ekspert tashkiloti nomi:" value={legalData?.name || '-'} />
            <DetailRow title="Ekspert tashkiloti STIRi:" value={legalData?.identity || '-'} />
            <DetailRow title="Ekspert tashkiloti manzili:" value={legalData?.address || '-'} />
            <DetailRow
              title="Ekspertiza tashkilotining akkreditatsiya raqami:"
              value={detail?.accreditationRegistryNumber || '-'}
            />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="customer_org" title="Tashkilot to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Tashkilot nomi:" value={customerData?.name || '-'} />
            <DetailRow title="Tashkilot STIRi:" value={customerData?.identity || '-'} />
            <DetailRow title="Tashkilot yuridik manzili:" value={customerData?.address || '-'} />
            <DetailRow title="Tashkilot telefon raqami:" value={customerData?.phoneNumber || '-'} />
            <DetailRow title="Tashkilot rahbari F.I.Sh:" value={customerData?.directorName || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="Obyekt to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Obyekt joylashgan manzil:" value={detail?.address || '-'} />
            <DetailRow title="Ekspertiza obyektining nomi:" value={detail?.objectName || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="conclusion_info" title="Ekspertiza xulosasi to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow
              title="Ekspertiza xulosasi turi:"
              value={ExpertiseTypeOptions.find((option) => option.value === detail.type)?.label || '-'}
            />
            <DetailRow title="Ekspertiza obyekti nomi:" value={detail?.expertiseName || '-'} />
            <DetailRow title="Ekspertiza xulosasi reyestr raqami:" value={detail?.registryNumber || '-'} />
            <DetailRow
              title="Ekspertiza xulosasi holati:"
              value={
                detail?.processStatus ? (
                  detail?.processStatus == 'NEW' ? (
                    <Badge variant="info">Yangi</Badge>
                  ) : detail?.processStatus == 'COMPLETED' ? (
                    <Badge variant="success">Yakunlangan</Badge>
                  ) : (
                    '-'
                  )
                ) : (
                  '-'
                )
              }
            />
            <DetailRow
              title="Ekspertiza xulosasi natijasi:"
              value={
                typeof detail?.result == 'boolean' ? (
                  detail?.result ? (
                    <Badge variant="success">Ijobiy</Badge>
                  ) : (
                    <Badge variant="error">Salbiy</Badge>
                  )
                ) : (
                  '-'
                )
              }
            />
            <DetailRow
              title="Ekspertiza xulosasi reyestrga qo‘yilgan sana:"
              value={detail?.registrationDate ? getDate(detail?.registrationDate) : '-'}
            />
            <DetailRow
              title="Ekspertiza xulosasi:"
              value={detail?.filePath ? <FileLink url={detail?.filePath} /> : '-'}
            />
            {detail.type === ExpertiseTypeEnum.XD && (
              <>
                {isOld && (
                  <>
                    <DetailRow title="Deklaratsiya ro‘yxat raqami:" value={detail.declarationRegistryNumber || '-'} />
                    <DetailRow
                      title="Deklaratsiya ro‘yxatga olingan sana:"
                      value={detail.declarationRegistrationDate ? getDate(detail.declarationRegistrationDate) : '-'}
                    />
                  </>
                )}
                <DetailRow
                  title="Deklaratsiya fayli:"
                  value={detail?.declarationFilePath ? <FileLink url={detail?.declarationFilePath} /> : 'Mavjud emas'}
                />
                <DetailRow
                  title="Hisob-kitob tushuntirish xati:"
                  value={
                    detail?.calculationLetterPath ? <FileLink url={detail?.calculationLetterPath} /> : 'Mavjud emas'
                  }
                />
                <DetailRow
                  title="Axborotnoma:"
                  value={detail?.informationNotePath ? <FileLink url={detail?.informationNotePath} /> : 'Mavjud emas'}
                />
              </>
            )}

            <DetailRow
              title="Ekspertiza xulosasining bekor qilinganligi asosi:"
              value={detail?.cancelledReason || '-'}
            />
            <DetailRow
              title="Ekspertiza xulosasining bekor qilinganligi sanasi:"
              value={detail?.cancelledDate ? getDate(detail?.cancelledDate) : '-'}
            />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
