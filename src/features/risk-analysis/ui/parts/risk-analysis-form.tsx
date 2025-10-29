import RiskAnalysisItem from '@/features/risk-analysis/ui/parts/risk-analysis-item.tsx';
import { FC } from 'react';
import { RiskIndicators } from '../riskAnalysis';

interface Props {
  data: RiskIndicators | null;
}

const RiskAnalysisForm: FC<Props> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>Tahlil ko'rsatkichlari mavjud emas.</div>;
  }

  const indicatorsArray = Object.entries(data);

  return (
    <div>
      {indicatorsArray.map(([key, indicatorData], idx) => {
        return <RiskAnalysisItem info={true} key={key} number={key} data={indicatorData} displayIndex={idx + 1} />;
      })}
    </div>
  );
};

export default RiskAnalysisForm;
