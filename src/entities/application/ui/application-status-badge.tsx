import { ApplicationStatus } from '@/entities/application';
import { cn } from '@/shared/lib/utils.ts';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export const ApplicationStatusBadge = ({
  status,
}: ApplicationStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case ApplicationStatus.NEW:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.IN_PROCESS:
        return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.IN_AGREEMENT:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.IN_APPROVAL:
        return 'bg-purple-100 text-purple-800';
      case ApplicationStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ApplicationStatus.NEW:
        return 'Янги';
      case ApplicationStatus.IN_PROCESS:
        return 'Ижрода';
      case ApplicationStatus.IN_AGREEMENT:
        return 'Келишишда';
      case ApplicationStatus.IN_APPROVAL:
        return 'Тасдиқлашда';
      case ApplicationStatus.COMPLETED:
        return 'Якунланган';
      case ApplicationStatus.REJECTED:
        return 'Қайтарилган';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(),
      )}
    >
      {getStatusText()}
    </span>
  );
};
