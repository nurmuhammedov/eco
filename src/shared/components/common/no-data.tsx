import Icon from '@/shared/components/common/icon';
import { cn } from '@/shared/lib/utils';

interface NoDataProps {
  className?: string;
  text?: string;
}

export const NoData = ({ className, text }: NoDataProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-start pt-10 gap-4 w-full min-h-[50vh]', className)}>
      <Icon name="no-data" size={160} />
      <p className="font-medium text-muted-foreground">{text || 'Hech qanday maʼlumot topilmadi!'}</p>
    </div>
  );
};
