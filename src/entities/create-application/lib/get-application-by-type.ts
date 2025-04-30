import { APPLICATIONS_DATA, ApplicationTypeEnum } from '@/entities/create-application';

export function getApplicationByType(type: ApplicationTypeEnum) {
  return APPLICATIONS_DATA.find((app) => app.type === type) || null;
}
