export type ActiveTab = 'categoryType' | 'checklists';

export type ActionButtonProps = {
  title: string;
  activeTab: ActiveTab;
  onAddCategoryType: () => void;
  onAddChecklist: () => void;
};
