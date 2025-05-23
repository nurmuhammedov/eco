export enum DepartmentActiveTab {
  CENTRAL_APPARATUS = 'central-apparatus',
  TERRITORIAL_DEPARTMENTS = 'territorial-departments',
}

export type DepartmentActionButtonProps = {
  title: string;
  onAddApparatus: () => void;
  onAddDepartment: () => void;
  activeTab: DepartmentActiveTab;
};
