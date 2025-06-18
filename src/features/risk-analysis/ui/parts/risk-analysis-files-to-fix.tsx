import { useFilesToFix } from '@/features/risk-analysis/hooks/use-files-to-fix.ts';

const RiskAnalysisFilesToFix = () => {
  const { data } = useFilesToFix();
  console.log(data);
  return <div>RiskAnalysisFilesToFix</div>;
};

export default RiskAnalysisFilesToFix;
