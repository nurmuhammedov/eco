import RiskAnalysisWidget from '@/widgets/risk-analysis/ui/risk-analysis-widget'

/** The route kept its old name; the analysis itself is quarterly since 2026-11-12 */
const RiskAnalysisMonthlyPage = () => {
  return <RiskAnalysisWidget periodType="QUARTERLY" />
}

export default RiskAnalysisMonthlyPage
