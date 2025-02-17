import { GoBack, StatusBadge } from '@/shared/components/common';
import { ApplicationStatus } from '@/shared/types/enums';

export default function Index() {
  return (
    <div className="flex gap-3">
      <GoBack title="Orqaga" />
      <StatusBadge status={ApplicationStatus.NEW}>Yangi</StatusBadge>
      <StatusBadge status={ApplicationStatus.PROCESS}>Ijroda</StatusBadge>
      <StatusBadge status={ApplicationStatus.AGREEMENT}>
        Kelishishda
      </StatusBadge>
      <StatusBadge status={ApplicationStatus.REJECTED}>
        Qaytarib yuborilgan
      </StatusBadge>
      <StatusBadge status={ApplicationStatus.CONFIRMATION}>
        Tasdiqlashda
      </StatusBadge>
    </div>
  );
}
