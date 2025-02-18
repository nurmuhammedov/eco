import { ReactNode } from 'react';
import { IconName } from '@/shared/components/common/icon';

export interface DetailCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export interface DetailCardAccordionProps {
  multiple?: boolean;
  children: ReactNode;
}

export interface DetailCardAccordionItemProps {
  value: string;
  title: string;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}
