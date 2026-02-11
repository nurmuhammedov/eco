import { lazy } from 'react'
import { withSuspense } from '@/shared/config/routes/utils'

const DashboardPage = lazy(() => import('@/pages/dashboard').then((module) => ({ default: module.DashboardPage })))
const Applications = lazy(() => import('@/pages/applications/ui/application-page'))
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'))
const RegisterPage = lazy(() => import('@/pages/register'))
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
const Permits = lazy(() => import('@/widgets/permits'))
const Inquiries = lazy(() => import('@/features/inquiries'))
// const EquipmentPrintPage = lazy(() => import('@/features/register/equipments/ui/equipment-print-page'))

// const CreateApplicationGridsIns = lazy(() => import('@/pages/applications/ui/create-application-grids-ins'))
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'))
const RegisterHFUpdatePage = lazy(() => import('@/pages/register/hf/hf-update'))
// const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'))
// const AddConclusionPage = lazy(() => import('@/pages/expertise/add-conclusion-page'))
// const EditConclusion = lazy(() => import('@/pages/expertise/edit-conclusion-page'))

export const chairmanRoutes = [
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
  // {
  //   id: 'APPEAL',
  //   path: 'applications/create',
  //   element: withSuspense(CreateApplicationGrids),
  // },
  // {
  //   id: 'APPEAL',
  //   path: 'applications/inspector/create',
  //   element: withSuspense(CreateApplicationGridsIns),
  // },
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
    path: 'register/hf/update/:id',
    element: withSuspense(RegisterHFUpdatePage),
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
  // {
  //   id: 'REGISTRY',
  //   path: 'register/:id/qr-page',
  //   element: withSuspense(EquipmentPrintPage),
  // },

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
  // {
  //   id: 'RISK_ANALYSIS',
  //   path: 'risk-analysis/my-tasks',
  //   element: withSuspense(InspectorTasks),
  // },

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
  // {
  //   id: 'CONCLUSION',
  //   path: 'accreditations/add',
  //   element: withSuspense(AddConclusionPage),
  // },
  {
    id: 'CONCLUSION',
    path: '/accreditations/detail/:id',
    element: withSuspense(ConclusionDetail),
  },
  // {
  //   id: 'CONCLUSION',
  //   path: '/accreditations/edit/:id',
  //   element: withSuspense(EditConclusion),
  // },

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
    path: 'reports/REPORT_1',
    element: withSuspense(ReportsDetail1),
  },
  {
    id: 'REPORT',
    path: 'reports/REPORT_2',
    element: withSuspense(ReportsDetail2),
  },
  {
    id: 'REPORT',
    path: 'reports/REPORT_3',
    element: withSuspense(ReportsDetail3),
  },
  {
    id: 'REPORT',
    path: 'reports/REPORT_4',
    element: withSuspense(ReportsDetail4),
  },
  {
    id: 'REPORT',
    path: 'reports/REPORT_5',
    element: withSuspense(ReportsDetail5),
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
