import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import { GoBack } from '@/shared/components/common';
import RiskAnalysisInfo from '@/features/risk-analysis/ui/parts/risk-analysis-info.tsx';

const RiskAnalysisDetail = () => {

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Tashkilot STIR: 000 000 002`} />
      </div>
      <DetailCardAccordion defaultValue={
        [
          // 'org_info',
          // 'appeal_info',
          // 'object_info',
          // 'files',
          // 'object_location',
          'risk_anlalysis_info'
        ]}>
        <DetailCardAccordion.Item value="org_info"
                                  title="Tashkilot to‘g‘risida maʼlumot">
          org_info
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="appeal_info"
                                  title="Tashkilot tomonidan yuborilgan arizalar to‘g‘risida ma’lumot">
          appeal_info
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info"
                                  title="XIChO, qurilma yoki INM to‘g‘risida ma’lumot">
          object_info
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="files"
                                  title="Taqdim etilgan hujjatlar (fayllar)">
          files
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_location"
                                  title="XIChO, qurilma yoki INM joylashgan joy">
          object_location
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="risk_anlalysis_info"
                                  title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          <RiskAnalysisInfo />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </>
  );
};

export default RiskAnalysisDetail;