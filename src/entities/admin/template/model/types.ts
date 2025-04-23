export interface Template {
  id: number;
  name: string;
  type: TemplateType;
  createdAt: string;
  description: string;
  updatedAt: string | null;
}

export type TemplateFormDTO = Omit<Template, 'id' | 'updated_at'>;

export interface TemplateCardProps {
  template: Template;
  onEdit?: (id: number) => void;
}

export enum TemplateType {
  IRS = 'IRS',
  XICHO_APPEAL = 'XICHO_APPEAL',
  EQUIPMENT_APPEAL = 'EQUIPMENT_APPEAL',
}
