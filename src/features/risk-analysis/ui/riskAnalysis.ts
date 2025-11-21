export interface Indicator {
  id: string;
  text: string;
  maxScore: number;
  score: number;
  description: string | null;
  filePath: string | null;
  status: string;
  expireDate: string | null;
}

export type RiskIndicators = Record<string, Indicator>;

export interface RiskAnalysisData {
  id: string;
  identity: number;
  type: string;
  belongId: string;
  totalScore: number;
  status: string;
  indicators: RiskIndicators;
  startDate: string;
  endDate: string;
  inspectorName: string | null;
  assignedDate: string | null;
}
