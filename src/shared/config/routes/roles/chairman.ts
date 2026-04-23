import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const DashboardPage = lazy(() => import('@/pages/dashboard').then((module) => ({ default: module.DashboardPage })))
const Applications = lazy(() => import('@/pages/applications/ui/application-page'))
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'))
const RegisterPage = lazy(() => import('@/pages/register'))
const ArchivePage = lazy(() => import('@/pages/archive'))
const RegisterHFDetail = lazy(() => import('@/features/register/hf/ui/hf-detail'))
const RegisterEquipmentDetail = lazy(() => import('@/features/register/equipments/ui/equipments-detail'))
const RegisterEquipmentAppealList = lazy(() => import('@/features/register/equipments/ui/equipments-appeal-list'))
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
const ExpertiseOrganizations = lazy(() => import('@/pages/expertise/organizations-page'))
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
const RiskComparisonReport = lazy(() => import('@/features/reports/ui/risk-comparison-report'))
const RiskDateComparisonReport = lazy(() => import('@/features/reports/ui/risk-date-comparison-report'))
const TurniketLogsReport = lazy(() => import('@/features/reports/ui/turniket-report'))
const TurniketLogsDetail = lazy(() => import('@/features/reports/ui/turniket-report-detail'))
const EmployeeDeviceLoginReport = lazy(() => import('@/features/reports/ui/employee-device-login-report'))
const EmployeesDashboard = lazy(() => import('@/features/reports/ui/employees-dashboard'))
const ReportHfEmployeeStats = lazy(() => import('@/features/reports/ui/hf-employee-stats-report'))
const AppealExecutionReport = lazy(() => import('@/features/reports/ui/appeal-execution'))
const AppealStatusDurationReport = lazy(() => import('@/features/reports/ui/appeal-status-duration'))
const Permits = lazy(() => import('@/widgets/permits'))
const Inquiries = lazy(() => import('@/features/inquiries'))
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'))
const RegisterChangePage = lazy(() => import('@/pages/register/register-change-page'))
const AccidentList = lazy(() => import('@/features/accident/ui/accident-list').then((m) => ({ default: m.default })))
const AccidentDetail = lazy(() =>
  import('@/features/accident/ui/accident-detail').then((m) => ({ default: m.AccidentDetail }))
)
const ElevatorsPage = lazy(() => import('@/pages/elevators'))

export const chairmanRoutes = [
  // ELEVATORS
  {
    id: 'ELEVATOR',
    path: 'elevators',
    element: withSuspense(ElevatorsPage),
  },
  {
    path: 'dashboard',
    element: withSuspense(DashboardPage),
  },
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
  {
    id: 'APPEAL',
    path: 'applications/create/:type',
    element: withSuspense(CreateApplicationForm),
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
    path: 'register/change/:id/:type',
    element: withSuspense(RegisterChangePage),
  },

  // ARCHIVE
  {
    id: 'ARCHIVE',
    path: 'archive',
    element: withSuspense(ArchivePage),
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/hf',
    element: withSuspense(RegisterHFDetail),
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/equipments',
    element: withSuspense(RegisterEquipmentDetail),
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/irs',
    element: withSuspense(RegisterIrsDetail),
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/xrays',
    element: withSuspense(RegisterXrayDetail),
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/auto',
    element: withSuspense(RegisterAutoDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/equipments',
    element: withSuspense(RegisterEquipmentDetail),
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/equipments/appeals',
    element: withSuspense(RegisterEquipmentAppealList),
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
    id: 'ACCREDITATION',
    path: 'expertise-organizations',
    element: withSuspense(ExpertiseOrganizations),
  },
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
    path: 'reports/appeal-execution',
    element: withSuspense(AppealExecutionReport),
  },
  {
    id: 'REPORT',
    path: 'reports/appeal-status-duration',
    element: withSuspense(AppealStatusDurationReport),
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
  {
    id: 'REPORT',
    path: 'reports/risk-comparison',
    element: withSuspense(RiskComparisonReport),
  },
  {
    id: 'REPORT',
    path: 'reports/risk-date-comparison',
    element: withSuspense(RiskDateComparisonReport),
  },
  {
    id: 'REPORT',
    path: 'reports/turniket-logs',
    element: withSuspense(TurniketLogsReport),
  },
  {
    id: 'REPORT',
    path: 'reports/turniket-logs/:id',
    element: withSuspense(TurniketLogsDetail),
  },
  {
    id: 'REPORT',
    path: 'reports/employee-device-login',
    element: withSuspense(EmployeeDeviceLoginReport),
  },
  {
    id: 'REPORT',
    path: 'reports/employees-dashboard',
    element: withSuspense(EmployeesDashboard),
  },
  {
    id: 'REPORT',
    path: 'reports/hf-employee-stats',
    element: withSuspense(ReportHfEmployeeStats),
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
  {
    id: 'ACCIDENT',
    path: 'accidents',
    element: withSuspense(AccidentList),
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/:id',
    element: withSuspense(AccidentDetail),
  },
]
