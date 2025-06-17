import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts';
import RiskAnalysisItem from '@/features/risk-analysis/ui/parts/risk-analysis-item.tsx';
import { useSearchParams } from 'react-router-dom';
import { useRiskAnalysisDetail } from '@/features/risk-analysis/hooks/use-risk-analysis-detail.ts';

const RiskAnalysisForm = () => {
  const [searchParams] = useSearchParams();
  const currentCat = searchParams.get('type') as 'XICHO';
  const { data, isLoading, isError } = useRiskAnalysisDetail();

  if (isLoading || isError) {
    return null;
  }

  return (
    <div>
      {/*@ts-ignore*/}
      {riskAnalysisData[currentCat] &&
        riskAnalysisData[currentCat].map((item, idx) => {
          return <RiskAnalysisItem number={idx + 1} data={item} key={item.title} globalData={data} />;
        })}
    </div>
  );
};

export default RiskAnalysisForm;
