import { ApplicationIcons } from '@/entities/create-application';
import { ApplicationCategory, ApplicationTypeEnum, MainApplicationCategory } from './enums';

export interface ApplicationCardItem {
  id: number;
  title: string;
  description: string;
  type: ApplicationTypeEnum;
  category: ApplicationCategory;
  parentId?: MainApplicationCategory;
  icon: keyof typeof ApplicationIcons;
}
