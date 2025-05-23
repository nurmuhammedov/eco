import { ReactNode } from 'react';

export type NavigationItem = {
  url: string;
  title: string;
  icon: ReactNode;
  isActive?: boolean;
  items?: {
    url: string;
    title: string;
  }[];
};

export type Navigation = NavigationItem[];
