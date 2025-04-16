import { ApplicationIcons } from '@/entities/create-application';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types.ts';

export enum MainApplicationCategory {
  REGISTER = 'REGISTER',
  UNREGISTER = 'UNREGISTER',
  REREGISTER = 'REREGISTER',
}

export enum ApplicationCategory {
  INM = 'INM',
  HOKQ = 'HOKQ',
  XICHO = 'XICHO',
  CADASTRE = 'CADASTRE',
  ACCREDITATION = 'ACCREDITATION',
  ATTESTATION_PREVENTION = 'ATTESTATION_PREVENTION',
}

export interface ApplicationCardItem {
  id: number;
  title: string;
  description: string;
  type: ApplicationTypeEnum;
  category: ApplicationCategory;
  parentId?: MainApplicationCategory;
  icon: keyof typeof ApplicationIcons;
}
