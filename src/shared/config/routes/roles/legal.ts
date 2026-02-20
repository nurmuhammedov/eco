import { withSuspense } from '@/shared/config/routes/utils'
import { lazy } from 'react'

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
const AddDeclarationPage = lazy(() => import('@/pages/declarations/add-declaration-page.tsx'))
const DeclarationDetailPage = lazy(() => import('@/pages/declarations/declaration-detail-page'))
const DeclarationsPage = lazy(() => import('@/pages/declarations/page'))
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'))
const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'))
const AddConclusionPage = lazy(() => import('@/pages/expertise/add-conclusion-page'))
const EditConclusion = lazy(() => import('@/pages/expertise/edit-conclusion-page'))
const AccidentList = lazy(() => import('@/features/accident/ui/accident-list').then((m) => ({ default: m.default })))
const AccidentDetail = lazy(() =>
  import('@/features/accident/ui/accident-detail').then((m) => ({ default: m.AccidentDetail }))
)
// const RegisterHFUpdatePage = lazy(() => import('@/pages/register/hf/hf-update'))
const RegisterUpdatePage = lazy(() => import('@/pages/register/register-update-page'))
const RegisterChangePage = lazy(() => import('@/pages/register/register-change-page'))

export const legalRoutes = [
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
    path: 'applications/create',
    element: withSuspense(CreateApplicationGrids),
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
  // {
  //   id: 'REGISTRY',
  //   path: 'register/hf/update/:id',
  //   element: withSuspense(RegisterHFUpdatePage),
  // },
  {
    id: 'REGISTRY',
    path: 'register/update/:type/:id',
    element: withSuspense(RegisterUpdatePage),
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
    path: 'accreditations/add',
    element: withSuspense(AddConclusionPage),
  },
  {
    id: 'CONCLUSION',
    path: '/accreditations/detail/:id',
    element: withSuspense(ConclusionDetail),
  },
  {
    id: 'CONCLUSION',
    path: '/accreditations/edit/:id',
    element: withSuspense(EditConclusion),
  },

  // DECLARATION
  {
    id: 'DECLARATION',
    path: 'declarations',
    element: withSuspense(DeclarationsPage),
  },
  {
    id: 'DECLARATION',
    path: 'declarations/add',
    element: withSuspense(AddDeclarationPage),
  },
  {
    id: 'DECLARATION',
    path: 'declarations/detail/:id',
    element: withSuspense(DeclarationDetailPage),
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
