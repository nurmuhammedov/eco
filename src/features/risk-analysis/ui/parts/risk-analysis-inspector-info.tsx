import { useInspectorInfo } from '@/features/risk-analysis/hooks/use-inspector-info.ts';
import { format } from 'date-fns';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/shared/lib/utils.ts';

const RiskAnalysisInspectorInfo = () => {
  const { data } = useInspectorInfo();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentIntervalId = searchParams.get('intervalId') || '';
  const isValidInterval = currentIntervalId == user?.interval?.id;
  if (!data) {
    return <div className={'py-5 px-5'}>Ma'lumot mavjud emas</div>;
  }
  return (
    <div>
      <p className="flex items-center gap-2 border-b-neutral-100 border-b px-2 py-3">
        <span className="text-neutral-500">Belgilangan inspektor F.I.SH:</span>
        <span className="font-medium">{data?.inspectorName}</span>
      </p>
      <p className="flex items-center gap-2 border-b border-b-neutral-100 px-2 py-3">
        <span className="text-neutral-500">Inspektor belgilangan sana:</span>
        <span className="font-medium">{format(data?.date, 'dd.MM.yyyy, HH:mm')}</span>
      </p>
      <p className="flex items-center gap-2  px-2 py-3">
        <span className="text-neutral-500">Davr:</span>
        <span className={cn('font-medium', { 'text-green-600': isValidInterval })}>
          {format(data?.startDate, 'dd.MM.yyyy')} - {format(data?.endDate, 'dd.MM.yyyy')}
        </span>
      </p>
    </div>
  );
};

export default RiskAnalysisInspectorInfo;
