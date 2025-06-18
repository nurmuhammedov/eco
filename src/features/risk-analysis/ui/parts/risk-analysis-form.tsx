import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts';
import RiskAnalysisItem from '@/features/risk-analysis/ui/parts/risk-analysis-item.tsx';
import { useSearchParams } from 'react-router-dom';
import { FC } from 'react';

interface Props {
  data: any;
}

const RiskAnalysisForm: FC<Props> = ({ data }) => {
  const [searchParams] = useSearchParams();
  const currentCat = searchParams.get('type') || '';

  return (
    <div>
      {/*@ts-ignore*/}
      {riskAnalysisData[currentCat] &&
        //@ts-ignore
        riskAnalysisData[currentCat].map((item, idx) => {
          return <RiskAnalysisItem number={idx + 1} data={item} key={item.title} globalData={data} />;
        })}
    </div>
  );
};

export default RiskAnalysisForm;
