// 1. Bitta indikator uchun interfeys (bu sizda mavjud)
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

// 2. Barcha indikatorlarni o'z ichiga olgan obyekt uchun tip (bu sizda mavjud)
export type RiskIndicators = Record<string, Indicator>;

// 3. API DAN KELADIGAN TO'LIQ MA'LUMOT UCHUN INTERFEYS (MANA SHUNI QO'SHISH KERAK)
export interface RiskAnalysisData {
  id: string;
  identity: number;
  type: string;
  belongId: string;
  totalScore: number;
  status: string;
  indicators: RiskIndicators; // Yuqoridagi tipdan foydalanamiz
  startDate: string;
  endDate: string;
  inspectorName: string | null;
  assignedDate: string | null;
}
