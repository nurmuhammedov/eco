import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types.ts';
import { ApplicationIcons } from '@/entities/create-application';

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
  icon: keyof typeof ApplicationIcons;
}
