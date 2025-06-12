export interface RiskAnalysisItem {
  id: string;
  inspectorName: string | null;
  registryNumber: string;
  address: string;
  name: string;
  legalName: string;
  legalTin: number;
}

export interface RiskAnalysisParams {
  isAssigned?: boolean;
  page?: number;
  size?: number;

  [key: string]: any;
}
