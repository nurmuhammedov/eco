import { useInspectorInfo } from '@/features/risk-analysis/hooks/use-inspector-info.ts';
import { format } from 'date-fns';

const RiskAnalysisInspectorInfo = () => {
  const { data } = useInspectorInfo();

  console.log(data);
  if (!data) {
    return null;
  }
  return (
    <div>
      <p className="flex items-center gap-2 border-b-neutral-100 border-b px-2 py-3">
        <span className="text-neutral-500">Belgilangan inspektor F.I.SH:</span>
        <span className="font-medium">{data?.inspectorName}</span>
      </p>
      <p className="flex items-center gap-2  px-2 py-3">
        <span className="text-neutral-500">Inspektor belgilangan sana:</span>
        <span className="font-medium">{format(data?.date, 'dd.MM.yyyy, HH:mm')}</span>
      </p>
    </div>
  );
};

export default RiskAnalysisInspectorInfo;
