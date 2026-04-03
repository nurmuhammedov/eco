import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const Applications = lazy(() => import('@/pages/applications/ui/application-page'))
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'))
const RegisterPage = lazy(() => import('@/pages/register'))
const RegisterHFDetail = lazy(() => import('@/features/register/hf/ui/hf-detail'))
const RegisterEquipmentDetail = lazy(() => import('@/features/register/equipments/ui/equipments-detail'))
const RegisterIrsDetail = lazy(() => import('@/features/register/irs/ui/irs-detail'))
const RegisterXrayDetail = lazy(() => import('@/features/register/xray/ui/xray-detail'))
const RegisterAutoDetail = lazy(() => import('@/features/register/auto/ui/auto-detail'))
const Preventions = lazy(() => import('@/widgets/prevention'))
const PreventionDetail = lazy(() => import('@/features/prevention/ui/prevention-detail'))
const RiskAnalysisPage = lazy(() => import('@/pages/risk-analysis'))
const RiskAnalysisDetailPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-detail'))
const RiskAnalysisDetailInfoPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-info-by-id'))
const InspectionsPage = lazy(() => import('@/pages/inspections/page'))
const InspectionsInfoPage = lazy(() => import('@/features/inspections/ui/inspections.info.tsx'))
const ExpertisePage = lazy(() => import('@/pages/expertise/page'))
const ConclusionDetail = lazy(() => import('@/pages/expertise/conclusion-detail-page'))
const DeclarationsPage = lazy(() => import('@/pages/declarations/page'))
const DeclarationDetailPage = lazy(() => import('@/pages/declarations/declaration-detail-page'))
const ReportsPage = lazy(() => import('@/features/reports/ui/reports'))
const ReportsDetail1 = lazy(() => import('@/features/reports/ui/report1'))
const ReportsDetail2 = lazy(() => import('@/features/reports/ui/report2'))
const ReportsDetail3 = lazy(() => import('@/features/reports/ui/report3'))
const ReportsDetail4 = lazy(() => import('@/features/reports/ui/report4'))
const ReportsDetail5 = lazy(() => import('@/features/reports/ui/report5'))
const ReportsDetail6 = lazy(() => import('@/features/reports/ui/report6'))
const ReportsDetail7 = lazy(() => import('@/features/reports/ui/report7'))
const ReportsDetail8 = lazy(() => import('@/features/reports/ui/report8'))
const ReportsDetail9 = lazy(() => import('@/features/reports/ui/report9'))
const ReportsDetail10 = lazy(() => import('@/features/reports/ui/report10'))
const ReportsDetail11 = lazy(() => import('@/features/reports/ui/report11'))
const PreventionStatsReport = lazy(() => import('@/features/reports/ui/prevention-stats'))
const InspectionStatsReport = lazy(() => import('@/features/reports/ui/inspection-stats'))
const Permits = lazy(() => import('@/widgets/permits'))
const Inquiries = lazy(() => import('@/features/inquiries'))
const RegisterChangePage = lazy(() => import('@/pages/register/register-change-page'))

export const headRoutes = [
  // APPEAL
  {
    id: 'APPEAL',
    path: 'applications',
    element: withSuspense(Applications),
  },
  {
    id: 'APPEAL',
    path: 'applications/detail/:id',
    element: withSuspense(ApplicationDetail),
  },

  // REGISTRY
  {
    id: 'REGISTRY',
    path: 'register',
    element: withSuspense(RegisterPage),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/hf',
    element: withSuspense(RegisterHFDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/equipments',
    element: withSuspense(RegisterEquipmentDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/irs',
    element: withSuspense(RegisterIrsDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/xrays',
    element: withSuspense(RegisterXrayDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/auto',
    element: withSuspense(RegisterAutoDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/change/:id/:type',
    element: withSuspense(RegisterChangePage),
  },

  // PREVENTION
  {
    id: 'PREVENTION',
    path: 'preventions',
    element: withSuspense(Preventions),
  },
  {
    id: 'PREVENTION',
    path: 'preventions/detail/:id',
    element: withSuspense(PreventionDetail),
  },

  // RISK_ANALYSIS
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis',
    element: withSuspense(RiskAnalysisPage),
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis/detail',
    element: withSuspense(RiskAnalysisDetailPage),
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis/info/:id',
    element: withSuspense(RiskAnalysisDetailInfoPage),
  },

  // INSPECTION
  {
    id: 'INSPECTION',
    path: 'inspections',
    element: withSuspense(InspectionsPage),
  },
  {
    id: 'INSPECTION',
    path: 'inspections/info',
    element: withSuspense(InspectionsInfoPage),
  },

  // ACCREDITATION / EXPERTISE
  {
    id: 'CONCLUSION',
    path: 'accreditations',
    element: withSuspense(ExpertisePage),
  },
  {
    id: 'CONCLUSION',
    path: '/accreditations/detail/:id',
    element: withSuspense(ConclusionDetail),
  },

  // DECLARATION
  {
    id: 'DECLARATION',
    path: 'declarations',
    element: withSuspense(DeclarationsPage),
  },
  {
    id: 'DECLARATION',
    path: 'declarations/detail/:id',
    element: withSuspense(DeclarationDetailPage),
  },

  // REPORT
  {
    id: 'REPORT',
    path: 'reports',
    element: withSuspense(ReportsPage),
  },
  {
    id: 'REPORT',
    path: 'reports/applications-regions',
    element: withSuspense(ReportsDetail1),
  },
  {
    id: 'REPORT',
    path: 'reports/applications-types',
    element: withSuspense(ReportsDetail2),
  },
  {
    id: 'REPORT',
    path: 'reports/registers-objects',
    element: withSuspense(ReportsDetail3),
  },
  {
    id: 'REPORT',
    path: 'reports/registers-new-objects',
    element: withSuspense(ReportsDetail4),
  },
  {
    id: 'REPORT',
    path: 'reports/registers-equipment-terms',
    element: withSuspense(ReportsDetail5),
  },
  {
    id: 'REPORT',
    path: 'reports/accidents',
    element: withSuspense(ReportsDetail6),
  },
  {
    id: 'REPORT',
    path: 'reports/incidents',
    element: withSuspense(ReportsDetail7),
  },
  {
    id: 'REPORT',
    path: 'reports/changes',
    element: withSuspense(ReportsDetail8),
  },
  {
    id: 'REPORT',
    path: 'reports/registers-deregister',
    element: withSuspense(ReportsDetail9),
  },
  {
    id: 'REPORT',
    path: 'reports/applications-execution',
    element: withSuspense(ReportsDetail10),
  },
  {
    id: 'REPORT',
    path: 'reports/registers-register',
    element: withSuspense(ReportsDetail11),
  },
  {
    id: 'REPORT',
    path: 'reports/prevention-stats',
    element: withSuspense(PreventionStatsReport),
  },
  {
    id: 'REPORT',
    path: 'reports/inspection-stats',
    element: withSuspense(InspectionStatsReport),
  },

  // PERMITS
  {
    id: 'PERMITS',
    path: 'permits',
    element: withSuspense(Permits),
  },

  // INQUIRY
  {
    id: 'INQUIRY',
    path: 'inquiries',
    element: withSuspense(Inquiries),
  },
]
