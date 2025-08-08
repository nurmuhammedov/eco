import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info.tsx';
import DetailRow from '@/shared/components/common/detail-row.tsx';

const LegalApplicantInfo = ({ tinNumber }: any) => {
  const { data } = useLegalApplicantInfo(tinNumber);
  return (
    <div className="py-1  flex flex-col">
      <DetailRow title="Tashkilot STIR:" value={data?.identity || '-'} />
      <DetailRow title="Tashkilot nomi:" value={data?.name || '-'} />
      <DetailRow title="Tashkilot tashkiliy-huquqiy shakli:" value={data?.legalForm || '-'} />
      <DetailRow title="Tashkilot mulkchilik shakli:" value={data?.legalOwnershipType || '-'} />
      <DetailRow title="Tashkilot rahbari F.I.SH:" value={data?.directorName || '-'} />
      <DetailRow title="Tashkilot manzili:" value={data?.address || '-'} />
      <DetailRow title="Tashkilot telefon raqami:" value={data?.phoneNumber || '-'} />
      <DetailRow
        title="Tashkilotning faoliyat yuritish holati:"
        value={
          data?.isActive ? (
            <span className="text-green-600">Faol</span>
          ) : (
            <span className="text-red-600">Faol emas</span>
          )
        }
      />
    </div>
  );
};

export default LegalApplicantInfo;
