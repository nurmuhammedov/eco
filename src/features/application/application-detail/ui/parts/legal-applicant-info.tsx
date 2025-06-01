import DetailRow from '@/shared/components/common/detail-row.tsx';
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx';

const LegalApplicantInfo = ({ tinNumber }: any) => {
  const { data } = useLegalApplicantInfo(tinNumber);
  return (
    <div className="py-1 px-2 flex flex-col">
      <DetailRow title="Tashkilot STIR:" value={data?.tin || '-'} />
      <DetailRow title="Tashkilot nomi:" value={data?.legalName || '-'} />
      <DetailRow title="Tashkilot tashkiliy-huquqiy shakli:" value={'-'} />
      <DetailRow title="Tashkilot rahbari F.I.SH:" value={data?.fullName || '-'} />
      {/*<DetailRow title="Tashkilot joylashgan viloyat:" value={'-'}/>*/}
      {/*<DetailRow title="Tashkilot joylashgan tuman:" value={'-'}/>*/}
      <DetailRow title="Tashkilot manzili:" value={data?.legalAddress || '-'} />
      <DetailRow title="Tashkilot telefon raqami:" value={'-'} />
      <DetailRow title="Tashkilot elektron pochta manzili:" value={'-'} />
      <DetailRow title="Tashkilotning faoliyat yuritish holati:" value={'-'} />
    </div>
  );
};

export default LegalApplicantInfo;
