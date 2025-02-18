import { IconName } from '@/shared/components/common/icon';

export type NavigationItem = {
  url: string;
  title: string;
  icon: IconName;
};

export type Navigation = NavigationItem[];
