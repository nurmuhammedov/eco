export interface Template {
  id: number;
  name: string;
  createdAt: string;
  type: TemplateType;
  description: string;
  content: string | null;
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
