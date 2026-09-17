import { lazy, ReactNode } from 'react'
import { UserRoles } from '@/entities/user'
import { withSuspense } from './utils'

const AccidentDetail = lazy(() =>
  import('@/features/accident/ui/accident-detail').then((m) => ({ default: m.AccidentDetail }))
)
const AccidentInjuryAdd = lazy(() =>
  import('@/features/accident/ui/accident-injury-add').then((m) => ({ default: m.AccidentAdd }))
)
const AccidentInjuryEdit = lazy(() =>
  import('@/features/accident/ui/accident-injury-edit').then((m) => ({ default: m.AccidentEdit }))
)
const AccidentList = lazy(() => import('@/features/accident/ui/accident-list').then((m) => ({ default: m.default })))
const AccidentNonInjuryAdd = lazy(() =>
  import('@/features/accident/ui/accident-non-injury-add').then((m) => ({ default: m.AccidentNonInjuryAdd }))
)
const AccidentNonInjuryEdit = lazy(() =>
  import('@/features/accident/ui/accident-non-injury-edit').then((m) => ({ default: m.AccidentNonInjuryEdit }))
)
const AddConclusionPage = lazy(() => import('@/pages/expertise/add-conclusion-page'))
const AddDeclarationPage = lazy(() => import('@/pages/declarations/add-declaration-page'))
const AddOldConclusionPage = lazy(() => import('@/pages/expertise/add-old-conclusion-page'))
const AppealExecutionReport = lazy(() => import('@/features/reports/ui/appeal-execution'))
const AppealStatusDurationReport = lazy(() => import('@/features/reports/ui/appeal-status-duration'))
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'))
const Applications = lazy(() => import('@/pages/applications/ui/application-page'))
const ArchivePage = lazy(() => import('@/pages/archive'))
const AttestationApplicantsPage = lazy(() => import('@/pages/attestation-applicants/ui/page'))
const AttestationApplicationDetailPage = lazy(() => import('@/pages/attestation-application-detail/ui/page'))
const AttestationCalendarsPage = lazy(() => import('@/pages/attestation-calendars/ui/page'))
const AttestationMyApplicationsPage = lazy(() => import('@/pages/attestation-my-applications/ui/page'))
const AttestationQuestionsPage = lazy(() => import('@/pages/attestation-questions/ui/page'))
const AttractionTypePage = lazy(() => import('@/pages/admin/attraction-type/page'))
const CadastreAdd = lazy(() => import('@/features/cadastre-passport/ui/cadastre-add'))
const CadastreDetail = lazy(() => import('@/features/cadastre-passport/ui/cadastre-detail'))
const CadastreList = lazy(() => import('@/features/cadastre-passport/ui/cadastre-list'))
const CategoryTypeViewPage = lazy(() => import('@/pages/admin/inspection/category-type-view-page'))
const ConclusionDetail = lazy(() => import('@/pages/expertise/conclusion-detail-page'))
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'))
const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'))
const CreateApplicationGridsIns = lazy(() => import('@/pages/applications/ui/create-application-grids-ins'))
const DashboardPage = lazy(() => import('@/pages/dashboard').then((m) => ({ default: m.DashboardPage })))
const DeclarationDetailPage = lazy(() => import('@/pages/declarations/declaration-detail-page'))
const DeclarationsPage = lazy(() => import('@/pages/declarations/page'))
const DecreeSignerPage = lazy(() =>
  import('@/features/admin/decree-signers').then((m) => ({ default: m.DecreeSignersPage }))
)
const DepartmentPage = lazy(() => import('@/pages/admin/department/ui'))
const DepartmentsPage = lazy(() => import('@/pages/kpi/departments-page'))
const EditConclusion = lazy(() => import('@/pages/expertise/edit-conclusion-page'))
const ElevatorsPage = lazy(() => import('@/pages/elevators'))
const EmployeeDeviceLoginReport = lazy(() => import('@/features/reports/ui/employee-device-login-report'))
const EmployeesDashboard = lazy(() => import('@/features/reports/ui/employees-dashboard'))
const EquipmentPage = lazy(() => import('@/pages/admin/equipment/equipment-page'))
const ExpertiseOrganizations = lazy(() => import('@/pages/expertise/organizations-page'))
const ExpertisePage = lazy(() => import('@/pages/expertise/page'))
const HazardousFacilitiesPage = lazy(() => import('@/pages/admin/hazardous-facility/ui'))
const HybridMailPage = lazy(() => import('@/features/admin/hybrid-mail/ui/hybrid-mail-page'))
const InquiriesStatusReport = lazy(() => import('@/features/reports/ui/inquiries-status'))
const InquiryAddPage = lazy(() => import('@/pages/inquiries/ui/inquiry-add'))
const InquiryDetailPage = lazy(() => import('@/pages/inquiries/ui/inquiry-detail'))
const InquiryListPage = lazy(() => import('@/features/inquiries/ui/inquiry-list'))
const InspectionExecutionReport = lazy(() => import('@/features/reports/ui/inspection-execution-report'))
const InspectionsInfoPage = lazy(() => import('@/features/inspections/ui/inspections.info'))
const InspectionsOtherPage = lazy(() => import('@/pages/inspections/other/page'))
const InspectionsRiskBasedPage = lazy(() => import('@/pages/inspections/risk-based/page'))
const InspectionStatsReport = lazy(() => import('@/features/reports/ui/inspection-stats'))
const InspectionSurveys = lazy(() => import('@/pages/admin/inspection/ui'))
const InteractiveServicePage = lazy(() =>
  import('@/pages/interactive-service').then((m) => ({ default: m.InteractiveServicePage }))
)
const KpiRegionalReport = lazy(() => import('@/features/reports/ui/kpi-regional-report'))
const KpiTasksPage = lazy(() => import('@/pages/kpi/kpi-tasks-page'))
const MetricsPage = lazy(() => import('@/pages/admin/metrics/page'))
const MyKpiPage = lazy(() => import('@/pages/kpi/my-kpi-page'))
const NewsDetailPage = lazy(() => import('@/features/news').then((m) => ({ default: m.NewsDetail })))
const NewsFormPage = lazy(() => import('@/features/news').then((m) => ({ default: m.NewsForm })))
const NewsListPage = lazy(() => import('@/features/news').then((m) => ({ default: m.NewsList })))
const OldConclusionDetailPage = lazy(() => import('@/pages/expertise/old-conclusion-detail-page'))
const OrganizationsPage = lazy(() => import('@/pages/organizations'))
const OrgWorkflowPage = lazy(() =>
  import('@/features/admin/org-workflow').then((m) => ({ default: m.OrgWorkflowPage }))
)
const ParksPage = lazy(() => import('@/pages/admin/parks'))
const Permits = lazy(() => import('@/widgets/permits'))
const PreventionDetail = lazy(() => import('@/features/prevention/ui/prevention-detail'))
const Preventions = lazy(() => import('@/widgets/prevention'))
const PreventionStatsReport = lazy(() => import('@/features/reports/ui/prevention-stats'))
const ProfilePage = lazy(() => import('@/pages/profile/page'))
const RegionsPage = lazy(() => import('@/pages/admin/regions/ui'))
const RegisterAutoDetail = lazy(() => import('@/features/register/auto/ui/auto-detail'))
const RegisterChangePage = lazy(() => import('@/pages/register/register-change-page'))
const RegisterEquipmentAppealList = lazy(() => import('@/features/register/equipments/ui/equipments-appeal-list'))
const RegisterEquipmentDetail = lazy(() => import('@/features/register/equipments/ui/equipments-detail'))
const RegisterHFDetail = lazy(() => import('@/features/register/hf/ui/hf-detail'))
const RegisterIrsDetail = lazy(() => import('@/features/register/irs/ui/irs-detail'))
const RegisterPage = lazy(() => import('@/pages/register'))
const RegisterRadiationProfileDetail = lazy(
  () => import('@/features/register/radiation-profile/ui/radiation-profile-detail')
)
const RegisterUpdatePage = lazy(() => import('@/pages/register/register-update-page'))
const RegisterXrayDetail = lazy(() => import('@/features/register/xray/ui/xray-detail'))
const ReportHfEmployeeStats = lazy(() => import('@/features/reports/ui/hf-employee-stats-report'))
const ReportIrsXrayStatus = lazy(() => import('@/features/reports/ui/irs-xray-status-report'))
const ApplicationsByRegionReport = lazy(() => import('@/features/reports/ui/applications-by-region'))
const ApplicationsExecutionReport = lazy(() => import('@/features/reports/ui/applications-execution'))
const RegistryRegistrationsReport = lazy(() => import('@/features/reports/ui/registry-registrations'))
const ApplicationsByTypeReport = lazy(() => import('@/features/reports/ui/applications-by-type'))
const RegistryObjectsReport = lazy(() => import('@/features/reports/ui/registry-objects'))
const RegistryNewObjectsReport = lazy(() => import('@/features/reports/ui/registry-new-objects'))
const RegistryEquipmentTermsReport = lazy(() => import('@/features/reports/ui/registry-equipment-terms'))
const AccidentsReport = lazy(() => import('@/features/reports/ui/accidents-report'))
const IncidentsReport = lazy(() => import('@/features/reports/ui/incidents-report'))
const RegistryChangesReport = lazy(() => import('@/features/reports/ui/registry-changes'))
const RegistryDeregistrationsReport = lazy(() => import('@/features/reports/ui/registry-deregistrations'))
const ReportsPage = lazy(() => import('@/features/reports/ui/reports'))
const RiskAnalysisDailyPage = lazy(() => import('@/pages/risk-analysis/daily'))
const RiskAnalysisDetailInfoPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-info-by-id'))
const RiskAnalysisDetailPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-detail'))
const RiskAnalysisMonthlyPage = lazy(() => import('@/pages/risk-analysis/monthly'))
const RiskComparisonReport = lazy(() => import('@/features/reports/ui/risk-comparison-report'))
const RiskDateComparisonReport = lazy(() => import('@/features/reports/ui/risk-date-comparison-report'))
const StaffsPage = lazy(() => import('@/pages/admin/staffs/ui'))
const Top100OrganizationsReport = lazy(() => import('@/features/reports/ui/top-100-organizations'))
const TurniketLogsDetail = lazy(() => import('@/features/reports/ui/turniket-report-detail'))
const TurniketLogsReport = lazy(() => import('@/features/reports/ui/turniket-report'))
const UserDelegationPage = lazy(() => import('@/pages/hr/user-delegation-page'))
const UpdateOrganizationPage = lazy(() => import('@/pages/register/update-organization-page'))
const UserLogsPage = lazy(() => import('@/pages/admin/user-logs/page'))

export interface AppRouteDefinition {
  /** The direction that has to be on the user for the page to exist. */
  id?: string
  path: string
  element: ReactNode
  /** Cabinets the page belongs to. */
  roles: UserRoles[]
}

/**
 * Every page in the application, once. The cabinets used to keep a file each,
 * which meant the same route was written out up to eight times - 474 entries
 * for 117 pages - and a change to one of them was routinely forgotten in the
 * others.
 */
export const APP_ROUTES: AppRouteDefinition[] = [
  {
    id: 'ACCIDENT',
    path: 'accidents',
    element: withSuspense(AccidentList),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/:id',
    element: withSuspense(AccidentDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/injury/:id/edit',
    element: withSuspense(AccidentInjuryEdit),
    roles: [UserRoles.INSPECTOR],
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/injury/add',
    element: withSuspense(AccidentInjuryAdd),
    roles: [UserRoles.INSPECTOR],
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/non-injury/:id/edit',
    element: withSuspense(AccidentNonInjuryEdit),
    roles: [UserRoles.INSPECTOR],
  },
  {
    id: 'ACCIDENT',
    path: 'accidents/non-injury/add',
    element: withSuspense(AccidentNonInjuryAdd),
    roles: [UserRoles.INSPECTOR],
  },
  {
    id: 'CONCLUSION',
    path: 'accreditations',
    element: withSuspense(ExpertisePage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { id: 'CONCLUSION', path: 'accreditations/add', element: withSuspense(AddConclusionPage), roles: [UserRoles.LEGAL] },
  {
    id: 'CONCLUSION',
    path: 'accreditations/detail/:id',
    element: withSuspense(ConclusionDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'CONCLUSION',
    path: 'accreditations/edit/:id',
    element: withSuspense(EditConclusion),
    roles: [UserRoles.LEGAL],
  },
  {
    id: 'CONCLUSION',
    path: 'accreditations/old/add',
    element: withSuspense(AddOldConclusionPage),
    roles: [UserRoles.LEGAL],
  },
  {
    id: 'CONCLUSION',
    path: 'accreditations/old/detail/:id',
    element: withSuspense(OldConclusionDetailPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'APPEAL',
    path: 'applications',
    element: withSuspense(Applications),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'APPEAL',
    path: 'applications/create',
    element: withSuspense(CreateApplicationGrids),
    roles: [UserRoles.INDIVIDUAL, UserRoles.LEGAL],
  },
  {
    id: 'APPEAL',
    path: 'applications/create/:type',
    element: withSuspense(CreateApplicationForm),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
    ],
  },
  {
    id: 'APPEAL',
    path: 'applications/detail/:id',
    element: withSuspense(ApplicationDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'APPEAL',
    path: 'applications/inspector/create',
    element: withSuspense(CreateApplicationGridsIns),
    roles: [UserRoles.INSPECTOR, UserRoles.MANAGER],
  },
  {
    id: 'ARCHIVE',
    path: 'archive',
    element: withSuspense(ArchivePage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/auto',
    element: withSuspense(RegisterAutoDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/equipments',
    element: withSuspense(RegisterEquipmentDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/hf',
    element: withSuspense(RegisterHFDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/irs',
    element: withSuspense(RegisterIrsDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ARCHIVE',
    path: 'archive/:id/xrays',
    element: withSuspense(RegisterXrayDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ARCHIVE',
    path: 'archive/radiation-profiles/:id',
    element: withSuspense(RegisterRadiationProfileDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ATTESTATION',
    path: 'attestation-applications',
    element: withSuspense(AttestationMyApplicationsPage),
    roles: [UserRoles.LEGAL],
  },
  {
    id: 'ATTESTATION',
    path: 'attestation-applications/:id',
    element: withSuspense(AttestationApplicationDetailPage),
    roles: [UserRoles.HEAD],
  },
  {
    id: 'ATTESTATION',
    path: 'attestation-calendars',
    element: withSuspense(AttestationCalendarsPage),
    roles: [UserRoles.HEAD],
  },
  {
    id: 'ATTESTATION',
    path: 'attestation-calendars/:calendarId/applicants',
    element: withSuspense(AttestationApplicantsPage),
    roles: [UserRoles.HEAD],
  },
  {
    id: 'ATTESTATION',
    path: 'attestation-questions',
    element: withSuspense(AttestationQuestionsPage),
    roles: [UserRoles.HEAD],
  },
  { path: 'attraction-types', element: withSuspense(AttractionTypePage), roles: [UserRoles.ADMIN] },
  {
    id: 'CADASTRE_PASSPORT',
    path: 'cadastre-passport',
    element: withSuspense(CadastreList),
    roles: [UserRoles.CHAIRMAN, UserRoles.INDIVIDUAL, UserRoles.LEGAL, UserRoles.MANAGER, UserRoles.PROCURATOR],
  },
  {
    id: 'CADASTRE_PASSPORT',
    path: 'cadastre-passport/:id',
    element: withSuspense(CadastreDetail),
    roles: [UserRoles.CHAIRMAN, UserRoles.INDIVIDUAL, UserRoles.LEGAL, UserRoles.MANAGER, UserRoles.PROCURATOR],
  },
  {
    id: 'CADASTRE_PASSPORT',
    path: 'cadastre-passport/add',
    element: withSuspense(CadastreAdd),
    roles: [UserRoles.CHAIRMAN, UserRoles.LEGAL, UserRoles.MANAGER, UserRoles.PROCURATOR],
  },
  {
    path: 'dashboard',
    element: withSuspense(DashboardPage),
    roles: [UserRoles.CHAIRMAN, UserRoles.INSPECTOR, UserRoles.PROCURATOR, UserRoles.REGIONAL],
  },
  {
    id: 'DECLARATION',
    path: 'declarations',
    element: withSuspense(DeclarationsPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { id: 'DECLARATION', path: 'declarations/add', element: withSuspense(AddDeclarationPage), roles: [UserRoles.LEGAL] },
  {
    id: 'DECLARATION',
    path: 'declarations/detail/:id',
    element: withSuspense(DeclarationDetailPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'DECLARATION',
    path: 'declarations/edit/:id',
    element: withSuspense(
      lazy(() => import('@/features/declarations/ui/edit-declaration').then((m) => ({ default: m.EditDeclaration })))
    ),
    roles: [UserRoles.LEGAL],
  },
  { path: 'decree-signers', element: withSuspense(DecreeSignerPage), roles: [UserRoles.ADMIN] },
  { path: 'department', element: withSuspense(DepartmentPage), roles: [UserRoles.ADMIN] },
  {
    id: 'ELEVATOR',
    path: 'elevators',
    element: withSuspense(ElevatorsPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { path: 'equipments', element: withSuspense(EquipmentPage), roles: [UserRoles.ADMIN] },
  {
    id: 'ACCREDITATION',
    path: 'expertise-organizations',
    element: withSuspense(ExpertiseOrganizations),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { path: 'hazardous-facilities', element: withSuspense(HazardousFacilitiesPage), roles: [UserRoles.ADMIN] },
  { path: 'hybrid-mail', element: withSuspense(HybridMailPage), roles: [UserRoles.ADMIN] },
  {
    id: 'INQUIRY',
    path: 'inquiries',
    element: withSuspense(InquiryListPage),
    roles: [
      UserRoles.ACCOUNTANT,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'INQUIRY',
    path: 'inquiries/add',
    element: withSuspense(InquiryAddPage),
    roles: [UserRoles.ACCOUNTANT, UserRoles.INDIVIDUAL],
  },
  {
    id: 'INQUIRY',
    path: 'inquiries/detail/:id',
    element: withSuspense(InquiryDetailPage),
    roles: [
      UserRoles.ACCOUNTANT,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { path: 'inspection-surveys', element: withSuspense(InspectionSurveys), roles: [UserRoles.ADMIN] },
  { path: 'inspection-surveys/:id', element: withSuspense(CategoryTypeViewPage), roles: [UserRoles.ADMIN] },
  {
    id: 'INSPECTION',
    path: 'inspections/info',
    element: withSuspense(InspectionsInfoPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'INSPECTION',
    path: 'inspections/other',
    element: withSuspense(InspectionsOtherPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'INSPECTION',
    path: 'inspections/risk-based',
    element: withSuspense(InspectionsRiskBasedPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    path: 'interactive-service',
    element: withSuspense(InteractiveServicePage),
    roles: [UserRoles.INTERACTIVE_SERVICE],
  },
  {
    path: 'kpi/departments',
    element: withSuspense(DepartmentsPage),
    roles: [UserRoles.CHAIRMAN, UserRoles.HR, UserRoles.PROCURATOR],
  },
  { id: 'KPI', path: 'kpi/my-tasks', element: withSuspense(MyKpiPage), roles: [UserRoles.HEAD] },
  {
    path: 'kpi/tasks',
    element: withSuspense(KpiTasksPage),
    roles: [UserRoles.CHAIRMAN, UserRoles.HR, UserRoles.PROCURATOR],
  },
  { path: 'metrics', element: withSuspense(MetricsPage), roles: [UserRoles.ADMIN] },
  {
    id: 'ANNOUNCEMENT',
    path: 'news',
    element: withSuspense(NewsListPage),
    roles: [
      UserRoles.ADMIN,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'ANNOUNCEMENT',
    path: 'news/:id',
    element: withSuspense(NewsDetailPage),
    roles: [
      UserRoles.ADMIN,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { path: 'news/create', element: withSuspense(NewsFormPage), roles: [UserRoles.ADMIN] },
  { path: 'news/edit/:id', element: withSuspense(NewsFormPage), roles: [UserRoles.ADMIN] },
  { path: 'org-workflow', element: withSuspense(OrgWorkflowPage), roles: [UserRoles.ADMIN] },
  {
    path: 'organizations',
    element: withSuspense(OrganizationsPage),
    roles: [UserRoles.ADMIN, UserRoles.HEAD, UserRoles.REGIONAL],
  },
  { path: 'parks', element: withSuspense(ParksPage), roles: [UserRoles.ADMIN] },
  {
    id: 'PERMITS',
    path: 'permits',
    element: withSuspense(Permits),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'PREVENTION',
    path: 'preventions',
    element: withSuspense(Preventions),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'PREVENTION',
    path: 'preventions/detail/:id',
    element: withSuspense(PreventionDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { path: 'profile', element: withSuspense(ProfilePage), roles: [UserRoles.LEGAL] },
  {
    id: 'REGISTRY',
    path: 'register',
    element: withSuspense(RegisterPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/auto',
    element: withSuspense(RegisterAutoDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/equipments',
    element: withSuspense(RegisterEquipmentDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/equipments/appeals',
    element: withSuspense(RegisterEquipmentAppealList),
    roles: [UserRoles.CHAIRMAN, UserRoles.PROCURATOR],
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/hf',
    element: withSuspense(RegisterHFDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/irs',
    element: withSuspense(RegisterIrsDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/:id/xrays',
    element: withSuspense(RegisterXrayDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/change/:id/:type',
    element: withSuspense(RegisterChangePage),
    roles: [
      UserRoles.ADMIN,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/radiation-profiles/:id',
    element: withSuspense(RegisterRadiationProfileDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INDIVIDUAL,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REGISTRY',
    path: 'register/update-organization/:type/:id',
    element: withSuspense(UpdateOrganizationPage),
    roles: [UserRoles.INSPECTOR, UserRoles.LEGAL, UserRoles.MANAGER],
  },
  {
    id: 'REGISTRY',
    path: 'register/update/:type/:id',
    element: withSuspense(RegisterUpdatePage),
    roles: [UserRoles.INDIVIDUAL, UserRoles.INSPECTOR, UserRoles.LEGAL, UserRoles.MANAGER],
  },
  {
    id: 'REPORT',
    path: 'reports',
    element: withSuspense(ReportsPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/accidents',
    element: withSuspense(AccidentsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/appeal-execution',
    element: withSuspense(AppealExecutionReport),
    roles: [UserRoles.CHAIRMAN, UserRoles.HEAD, UserRoles.MANAGER, UserRoles.PROCURATOR, UserRoles.REGIONAL],
  },
  {
    id: 'REPORT',
    path: 'reports/appeal-status-duration',
    element: withSuspense(AppealStatusDurationReport),
    roles: [UserRoles.CHAIRMAN, UserRoles.HEAD, UserRoles.MANAGER, UserRoles.PROCURATOR, UserRoles.REGIONAL],
  },
  {
    id: 'REPORT',
    path: 'reports/applications-execution',
    element: withSuspense(ApplicationsExecutionReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/applications-regions',
    element: withSuspense(ApplicationsByRegionReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/applications-types',
    element: withSuspense(ApplicationsByTypeReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/changes',
    element: withSuspense(RegistryChangesReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/employee-device-login',
    element: withSuspense(EmployeeDeviceLoginReport),
    roles: [UserRoles.ADMIN, UserRoles.CHAIRMAN, UserRoles.MANAGER, UserRoles.PROCURATOR],
  },
  {
    id: 'REPORT',
    path: 'reports/employees-dashboard',
    element: withSuspense(EmployeesDashboard),
    roles: [UserRoles.ADMIN, UserRoles.CHAIRMAN, UserRoles.PROCURATOR],
  },
  {
    id: 'REPORT',
    path: 'reports/hf-employee-stats',
    element: withSuspense(ReportHfEmployeeStats),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/incidents',
    element: withSuspense(IncidentsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/inquiries-status',
    element: withSuspense(InquiriesStatusReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/inspection-execution',
    element: withSuspense(InspectionExecutionReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/inspection-stats',
    element: withSuspense(InspectionStatsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/irs-xray-status',
    element: withSuspense(ReportIrsXrayStatus),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    path: 'reports/kpi-regional',
    element: withSuspense(KpiRegionalReport),
    roles: [
      UserRoles.ADMIN,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/prevention-stats',
    element: withSuspense(PreventionStatsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/registers-deregister',
    element: withSuspense(RegistryDeregistrationsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/registers-equipment-terms',
    element: withSuspense(RegistryEquipmentTermsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/registers-new-objects',
    element: withSuspense(RegistryNewObjectsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/registers-objects',
    element: withSuspense(RegistryObjectsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/registers-register',
    element: withSuspense(RegistryRegistrationsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/risk-comparison',
    element: withSuspense(RiskComparisonReport),
    roles: [UserRoles.CHAIRMAN, UserRoles.MANAGER, UserRoles.PROCURATOR],
  },
  {
    id: 'REPORT',
    path: 'reports/risk-date-comparison',
    element: withSuspense(RiskDateComparisonReport),
    roles: [UserRoles.CHAIRMAN, UserRoles.MANAGER, UserRoles.PROCURATOR, UserRoles.REGIONAL],
  },
  {
    id: 'REPORT',
    path: 'reports/top-100-organizations',
    element: withSuspense(Top100OrganizationsReport),
    roles: [
      UserRoles.ADMIN,
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/turniket-logs',
    element: withSuspense(TurniketLogsReport),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.HR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'REPORT',
    path: 'reports/turniket-logs/:id',
    element: withSuspense(TurniketLogsDetail),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.HR,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis',
    element: withSuspense(RiskAnalysisMonthlyPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis/daily',
    element: withSuspense(RiskAnalysisDailyPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis/detail',
    element: withSuspense(RiskAnalysisDetailPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis/info/:id',
    element: withSuspense(RiskAnalysisDetailInfoPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  {
    id: 'RISK_ANALYSIS',
    path: 'risk-analysis/monthly',
    element: withSuspense(RiskAnalysisMonthlyPage),
    roles: [
      UserRoles.CHAIRMAN,
      UserRoles.HEAD,
      UserRoles.INSPECTOR,
      UserRoles.LEGAL,
      UserRoles.MANAGER,
      UserRoles.PROCURATOR,
      UserRoles.REGIONAL,
    ],
  },
  { path: 'staffs', element: withSuspense(StaffsPage), roles: [UserRoles.ADMIN] },
  { path: 'territories', element: withSuspense(RegionsPage), roles: [UserRoles.ADMIN] },
  { path: 'user-delegation', element: withSuspense(UserDelegationPage), roles: [UserRoles.HR] },
  { path: 'user-logs', element: withSuspense(UserLogsPage), roles: [UserRoles.ADMIN] },
]
