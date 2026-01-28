import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
import useDetail from '@/shared/hooks/api/useDetail'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { getDate } from '@/shared/utils/date'
import FileLink from '@/shared/components/common/file-link'

export const DeclarationDetail = () => {
  const { id } = useParams()

  const { detail, isFetching } = useDetail<any>('/declarations', id, !!id)

  if (isFetching) {
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
    <div className="mt-4">
      <DetailCardAccordion defaultValue={['customer_org', 'legal_org', 'object_info', 'declaration_info']}>
        <DetailCardAccordion.Item value="customer_org" title="Buyurtmachi tashkilot to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Tashkilot nomi:" value={detail?.customerName || '-'} />
            <DetailRow title="Tashkilot STIRi:" value={detail?.customerTin || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="legal_org" title="Deklaratsiya ishlab chiquvchi tashkilot">
          <div className="flex flex-col py-1">
            <DetailRow title="Tashkilot nomi:" value={detail?.legalName || '-'} />
            <DetailRow title="Tashkilot STIRi:" value={detail?.legalTin || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="XICHO to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="XICHO joylashgan manzil:" value={detail?.address || '-'} />
            <DetailRow title="XICHO nomi:" value={detail?.hfName || '-'} />
            <DetailRow title="XICHO reyestr raqami:" value={detail?.hfRegistryNumber || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="declaration_info" title="Deklaratsiya to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Deklaratsiya ro‘yxat raqami:" value={detail?.registryNumber || '-'} />
            <DetailRow title="Ekspertiza xulosasi reyestr raqami:" value={detail?.conclusionRegistryNumber || '-'} />
            <DetailRow title="Yaratilgan sana:" value={detail?.createdAt ? getDate(detail?.createdAt) : '-'} />
            <DetailRow
              title="Deklaratsiya fayli:"
              value={detail?.filePath ? <FileLink url={detail?.filePath} /> : '-'}
            />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
