export enum ApplicationCategory {
  INM = 'INM',
  HOKQ = 'HOKQ',
  XICHO = 'XICHO',
  CADASTRE = 'CADASTRE',
  ACCREDITATION = 'ACCREDITATION',
  ATTESTATION_PREVENTION = 'ATTESTATION_PREVENTION',
}
export type ApplicationCategoryItem = {
  name: string;
  id: ApplicationCategory;
};
