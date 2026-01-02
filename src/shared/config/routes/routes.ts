import { UserRoles } from '@/entities/user/model/types'
import { lazy } from 'react'

// Auth pages
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'))
const OneIdLoginPage = lazy(() => import('@/pages/auth/ui/login-page'))

// NotFound page
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'))

// Applications pages
const Applications = lazy(() => import('@/pages/applications/ui/application-page'))
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'))
const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'))
const CreateApplicationGridsIns = lazy(() => import('@/pages/applications/ui/create-application-grids-ins'))
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'))

// Prevention
const Preventions = lazy(() => import('@/widgets/prevention'))
const PreventionDetail = lazy(() => import('@/features/prevention/ui/prevention-detail'))

// Permits
const Permits = lazy(() => import('@/widgets/permits'))

//ContactPage
const ContactPage = lazy(() => import('@/pages/qr-form'))

//Inquiries
const Inquiries = lazy(() => import('@/features/inquiries'))

// Other pages
const StaffsPage = lazy(() => import('@/pages/admin/staffs/ui'))
const ReportsPage = lazy(() => import('@/features/reports/ui/reports'))
const ReportsDetail1 = lazy(() => import('@/features/reports/ui/report1'))
const ReportsDetail2 = lazy(() => import('@/features/reports/ui/report2'))
const ReportsDetail3 = lazy(() => import('@/features/reports/ui/report3'))
const ReportsDetail4 = lazy(() => import('@/features/reports/ui/report4'))
const RegionsPage = lazy(() => import('@/pages/admin/regions/ui'))
const DepartmentPage = lazy(() => import('@/pages/admin/department/ui'))
const EquipmentPage = lazy(() => import('@/pages/admin/equipment/equipment-page'))
const HazardousFacilitiesPage = lazy(() => import('@/pages/admin/hazardous-facility/ui'))
const RegisterPage = lazy(() => import('@/pages/register'))
const RegisterHFUpdatePage = lazy(() => import('@/pages/register/hf/hf-update'))
const RegisterHFDetail = lazy(() => import('@/features/register/hf/ui/hf-detail'))
const RegisterEquipmentDetail = lazy(() => import('@/features/register/equipments/ui/equipments-detail'))
const RegisterEquipmentAppealList = lazy(() => import('@/features/register/equipments/ui/equipments-appeal-list'))
const EquipmentPrintPage = lazy(() => import('@/features/register/equipments/ui/equipment-print-page'))
const RegisterIrsDetail = lazy(() => import('@/features/register/irs/ui/irs-detail'))
const RegisterXrayDetail = lazy(() => import('@/features/register/xray/ui/xray-detail'))
const RegisterAutoDetail = lazy(() => import('@/features/register/auto/ui/auto-detail'))
const RiskAnalysisPage = lazy(() => import('@/pages/risk-analysis'))
const RiskAnalysisDetailPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-detail'))
const RiskAnalysisDetailInfoPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-info-by-id'))
const ExpertisePage = lazy(() => import('@/pages/expertise/page'))
const AddConclusionPage = lazy(() => import('@/pages/expertise/add-conclusion-page'))
const UserLogsPage = lazy(() => import('@/pages/admin/user-logs/page'))

const InspectionsInfoPage = lazy(() => import('@/features/inspections/ui/inspections.info.tsx'))
const InspectionsPage = lazy(() => import('@/pages/inspections/page'))
const InspectionSurveys = lazy(() => import('@/pages/admin/inspection/ui'))
const InspectorTasks = lazy(() => import('@/features/risk-analysis/ui/inspector-tasks'))
const ConclusionDetail = lazy(() => import('@/pages/expertise/conclusion-detail-page'))
const ExpertiseOrganizations = lazy(() => import('@/pages/expertise/organizations-page'))
const EditConclusion = lazy(() => import('@/pages/expertise/edit-conclusion-page'))
const AttractionTypePage = lazy(() => import('@/pages/admin/attraction-type/page'))

export const appRoutes = [
  {
    path: 'applications',
    component: Applications,
    roles: [],
  },
  {
    path: 'risk-analysis/my-tasks',
    component: InspectorTasks,
    roles: [UserRoles.INSPECTOR],
  },
  {
    path: 'applications/create',
    component: CreateApplicationGrids,
    roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL],
  },
  {
    path: 'applications/inspector/create',
    component: CreateApplicationGridsIns,
    roles: [UserRoles.INSPECTOR, UserRoles.MANAGER],
  },
  {
    path: 'applications/create/:type',
    component: CreateApplicationForm,
    roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.INSPECTOR, UserRoles.MANAGER, UserRoles.CHAIRMAN],
  },
  {
    path: 'applications/detail/:id',
    component: ApplicationDetail,
    roles: [],
  },
  {
    path: 'reports',
    component: ReportsPage,
    roles: [UserRoles.CHAIRMAN],
  },
  {
    path: 'reports/create/REPORT_1',
    component: ReportsDetail1,
    roles: [UserRoles.CHAIRMAN],
  },
  {
    path: 'reports/create/REPORT_2',
    component: ReportsDetail2,
    roles: [UserRoles.CHAIRMAN],
  },
  {
    path: 'reports/create/REPORT_3',
    component: ReportsDetail3,
    roles: [UserRoles.CHAIRMAN],
  },
  {
    path: 'reports/create/REPORT_4',
    component: ReportsDetail4,
    roles: [UserRoles.CHAIRMAN],
  },
  {
    path: 'register',
    component: RegisterPage,
    roles: [],
  },
  {
    path: 'register/:id/hf',
    component: RegisterHFDetail,
    roles: [],
  },
  {
    path: 'register/hf/update/:id',
    component: RegisterHFUpdatePage,
    roles: [UserRoles.INSPECTOR, UserRoles.CHAIRMAN],
  },
  {
    path: 'register/:id/equipments',
    component: RegisterEquipmentDetail,
    roles: [],
  },
  {
    path: 'register/:id/equipments/appeals',
    component: RegisterEquipmentAppealList,
    roles: [],
  },
  {
    path: 'register/:id/irs',
    component: RegisterIrsDetail,
    roles: [],
  },
  {
    path: 'register/:id/xrays',
    component: RegisterXrayDetail,
    roles: [],
  },
  {
    path: 'register/:id/auto',
    component: RegisterAutoDetail,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'register/:id/qr-page',
    component: EquipmentPrintPage,
    roles: [],
  },
  {
    path: 'territories',
    component: RegionsPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'department',
    component: DepartmentPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'inspection-surveys',
    component: InspectionSurveys,
    roles: [UserRoles.ADMIN],
  },

  {
    path: 'staffs',
    component: StaffsPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'hazardous-facilities',
    component: HazardousFacilitiesPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'equipments',
    component: EquipmentPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'attraction-types',
    component: AttractionTypePage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'user-logs',
    component: UserLogsPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'expertise-organizations',
    component: ExpertiseOrganizations,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'risk-analysis',
    component: RiskAnalysisPage,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'risk-analysis/detail',
    component: RiskAnalysisDetailPage,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'risk-analysis/info/:id',
    component: RiskAnalysisDetailInfoPage,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'inspections',
    component: InspectionsPage,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'inspections/info',
    component: InspectionsInfoPage,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },

  // Prevention
  {
    path: 'preventions',
    component: Preventions,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
  {
    path: 'preventions/detail/:id',
    component: PreventionDetail,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },

  // Conclusions
  {
    path: 'accreditations',
    component: ExpertisePage,
    roles: [
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.REGIONAL,
      UserRoles.MANAGER,
      UserRoles.HEAD,
      UserRoles.CHAIRMAN,
    ],
  },
  {
    path: 'accreditations/add',
    component: AddConclusionPage,
    roles: [
      UserRoles.LEGAL,
      UserRoles.INSPECTOR,
      UserRoles.REGIONAL,
      UserRoles.MANAGER,
      UserRoles.HEAD,
      UserRoles.CHAIRMAN,
    ],
  },
  {
    path: '/accreditations/detail/:id',
    component: ConclusionDetail,
    roles: [
      UserRoles.LEGAL,
      UserRoles.INSPECTOR,
      UserRoles.REGIONAL,
      UserRoles.MANAGER,
      UserRoles.HEAD,
      UserRoles.CHAIRMAN,
    ],
  },
  {
    path: '/accreditations/edit/:id',
    component: EditConclusion,
    roles: [UserRoles.LEGAL],
  },

  //Permits
  {
    path: 'permits',
    component: Permits,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },

  //Inquiries
  {
    path: 'inquiries',
    component: Inquiries,
    roles: [UserRoles.INSPECTOR, UserRoles.REGIONAL, UserRoles.MANAGER, UserRoles.HEAD, UserRoles.CHAIRMAN],
  },
]

export const publicRoutes = [
  {
    path: '/qr/:id/equipments',
    component: ContactPage,
  },
]

export const authRoutes = [
  {
    path: 'login',
    component: OneIdLoginPage,
    roles: [],
  },
  {
    path: 'login/admin',
    roles: [],
    component: AdminLogin,
  },
]

export const specialComponents = {
  notFound: NotFound,
}
