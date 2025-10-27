import { FC } from 'react';
import { RiskAnalysisData } from '../riskAnalysis'; // Manzilni to'g'rilang
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils.ts';
import { useSearchParams } from 'react-router-dom';

interface Props {
  data: RiskAnalysisData | null;
}

const RiskAnalysisInspectorInfo: FC<Props> = ({ data }) => {
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
        <span className="font-medium">{data.inspectorName || 'Kiritilmagan'}</span>
      </p>
      <p className="flex items-center gap-2 border-b border-b-neutral-100 px-2 py-3">
        <span className="text-neutral-500">Inspektor belgilangan sana:</span>
        <span className="font-medium">
          {data.assignedDate ? format(new Date(data.assignedDate), 'dd.MM.yyyy, HH:mm') : 'Kiritilmagan'}
        </span>
      </p>
      <p className="flex items-center gap-2 px-2 py-3">
        <span className="text-neutral-500">Davr:</span>
        <span className={cn('font-medium', { 'text-green-600': isValidInterval })}>
          {data.startDate ? format(new Date(data.startDate), 'dd.MM.yyyy') : ''} -{' '}
          {data.endDate ? format(new Date(data.endDate), 'dd.MM.yyyy') : ''}
        </span>
      </p>
    </div>
  );
};

export default RiskAnalysisInspectorInfo;
