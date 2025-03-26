import { IconName } from '@/shared/components/common/icon';

export type NavigationItem = {
  url: string;
  title: string;
  icon: IconName;
  isActive?: boolean;
  items?: {
    url: string;
    title: string;
  }[];
};

export type Navigation = NavigationItem[];
