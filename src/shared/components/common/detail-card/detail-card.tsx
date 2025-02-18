import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import Icon from '@/shared/components/common/icon';

interface DetailCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const DetailCard = ({ icon, title, children }: DetailCardProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader className="bg-blue-200 rounded-t-lg px-4 py-5">
        <CardTitle className="flex items-center gap-2 text-lg text-blue-400 font-semibold">
          {icon ?? <Icon name="word" />} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">{children}</CardContent>
    </Card>
  );
};

DetailCard.displayName = 'DetailCard';
