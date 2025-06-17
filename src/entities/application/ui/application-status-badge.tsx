import { ApplicationStatus } from '@/entities/application';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export const ApplicationStatusBadge = ({ status }: ApplicationStatusBadgeProps) => {
  const { t } = useTranslation('common');
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
      case ApplicationStatus.CANCELED:
        return 'bg-red-100 text-red-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ApplicationStatus.NEW:
        return 'application_status.NEW';
      case ApplicationStatus.IN_PROCESS:
        return 'application_status.IN_PROCESS';
      case ApplicationStatus.IN_AGREEMENT:
        return 'application_status.IN_AGREEMENT';
      case ApplicationStatus.IN_APPROVAL:
        return 'application_status.IN_APPROVAL';
      case ApplicationStatus.COMPLETED:
        return 'application_status.COMPLETED';
      case ApplicationStatus.REJECTED:
        return 'application_status.REJECTED';
      case ApplicationStatus.CANCELED:
        return 'application_status.CANCELED';
      default:
        return status;
    }
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor())}>
      {t(getStatusText())}
    </span>
  );
};
