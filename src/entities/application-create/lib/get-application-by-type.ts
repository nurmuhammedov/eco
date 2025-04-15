import { APPLICATIONS_DATA } from '@/entities/application-create';
import { ApplicationTypeEnum } from '@/entities/user/applications/create-application/model/application.types';

export function getApplicationByType(type: ApplicationTypeEnum) {
  return APPLICATIONS_DATA.find((app) => app.type === type) || null;
}
