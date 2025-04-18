import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx';
import Icon from '@/shared/components/common/icon';
import type { DetailCardProps } from '../model/detail-card-types';

export const DetailCard = ({ icon, title, children }: DetailCardProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader className="bg-blue-200 rounded-t-lg px-4 py-4 3xl:py-5">
        <CardTitle className="flex items-center gap-2 3xl:text-lg text-blue-400">
          {icon ?? <Icon name="word" className="size-5 3xl:size-6" />} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">{children}</CardContent>
    </Card>
  );
};

DetailCard.displayName = 'DetailCard';
