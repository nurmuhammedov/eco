export type ActiveTab = 'regions' | 'districts';

export type ActionButtonProps = {
  title: string;
  activeTab: ActiveTab;
  onAddRegion: () => void;
  onAddDistrict: () => void;
};
