import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import useDetail from '@/shared/hooks/api/useDetail';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import { ExpertiseSubTypeOptions, ExpertiseTypeOptions } from '@/entities/expertise/model/constants';
import { getDate } from '@/shared/utils/date';
import { Badge } from '@/shared/components/ui/badge';
import FileLink from '@/shared/components/common/file-link';

export const DetailConclusion = () => {
  const { id } = useParams();

  const { detail, isFetching } = useDetail<any>('/conclusions', id, !!id);
  const { detail: legalData, isFetching: fetchingData } = useDetail<any>(
    '/users/legal/',
    detail?.legalTin,
    !!detail?.legalTin,
  );
  const { detail: customerData, isFetching: fetchingCustomerData } = useDetail<any>(
    '/users/legal/',
    detail?.customerTin,
    !!detail?.customerTin,
  );

  if (isFetching || fetchingData || fetchingCustomerData) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Yuklanmoqda...</p>
        </CardContent>
      </Card>
    );
  }

  if (!detail) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4">
      <DetailCardAccordion defaultValue={['expert_org', 'customer_org', 'object_info', 'conclusion_info']}>
        <DetailCardAccordion.Item value="expert_org" title="Ekspert tashkiloti to‘g‘risida ma’lumot">
          <div className="py-1 flex flex-col">
            <DetailRow title="Ekspert tashkiloti nomi:" value={legalData?.name || '-'} />
            <DetailRow title="Ekspert tashkiloti STIRsi:" value={legalData?.identity || '-'} />
            <DetailRow title="Ekspert tashkiloti manzili:" value={legalData?.address || '-'} />
            <DetailRow title="Ekspertiza tashkilotining akkreditatsiya raqami:" value={'-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="customer_org" title="Tashkilot to‘g‘risida ma’lumot">
          <div className="py-1 flex flex-col">
            <DetailRow title="Tashkilot nomi:" value={customerData?.name || '-'} />
            <DetailRow title="Tashkilot STIRsi:" value={customerData?.identity || '-'} />
            <DetailRow title="Tashkilot yuridik manzili:" value={customerData?.address || '-'} />
            <DetailRow title="Tashkilot telefon raqami:" value={customerData?.phoneNumber || '-'} />
            <DetailRow title="Tashkilot rahbari F.I.Sh:" value={customerData?.directorName || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="Obyekt to‘g‘risida ma’lumot">
          <div className="py-1 flex flex-col">
            <DetailRow title="Obyekt joylashgan manzil:" value={detail?.address || '-'} />
            <DetailRow title="Ekspertiza obyektining nomi:" value={detail?.objectName || '-'} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="conclusion_info" title="Ekspertiza xulosasi to‘g‘risida ma’lumot">
          <div className="py-1 flex flex-col">
            <DetailRow
              title="Ekspertiza xulosasi turi:"
              value={ExpertiseTypeOptions?.find((i) => i?.value == detail?.type)?.label || '-'}
            />
            <DetailRow
              title="Ekspertiza obyekti turi:"
              value={ExpertiseSubTypeOptions?.find((i) => i?.value == detail?.subType)?.label || '-'}
            />
            <DetailRow title="Ekspertiza obyekti nomi" value={detail?.prefix || '-'} />
            <DetailRow title="Ekspertiza xulosasi natijasi:" value={detail?.result || '-'} />
            <DetailRow title="Ekspertiza xulosasi reyestr raqami:" value={detail?.registryNumber || '-'} />
            <DetailRow
              title="Ekspertiza xulosasi reyestrga qo‘yilgan sana:"
              value={detail?.registrationDate ? getDate(detail?.registrationDate) : '-'}
            />
            <DetailRow
              title="Ekspertiza xulosasi:"
              value={detail?.filePath ? <FileLink url={detail?.filePath} /> : '-'}
            />
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
              title="Ekspertiza xulosasining bekor qilinganligi asosi va sanasi:"
              value={detail?.cancelledReason || '-'}
            />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
};
