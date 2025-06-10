import { ApplicationIcons } from '@/entities/create-application';
import { ApplicationCategory, ApplicationTypeEnum, MainApplicationCategory } from './enums';

export interface ApplicationCardItem {
  id: number;
  title: string;
  name?: string;
  description: string;
  type: ApplicationTypeEnum;
  category: ApplicationCategory;
  parentId?: MainApplicationCategory;
  equipmentType?: ApplicationTypeEnum;
  icon: keyof typeof ApplicationIcons;
}
