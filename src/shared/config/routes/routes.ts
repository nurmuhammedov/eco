import { UserRoles } from '@/entities/user';
import AttractionTypePage from '@/pages/admin/attraction-type/page';
import { lazy } from 'react';

// Error pages
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'));
const UnAuthorized = lazy(() => import('@/features/auth/ui/unauthorized'));

// Application pages
const Applications = lazy(() => import('@/pages/applications/ui/application-page'));
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'));
const AttestationDetail = lazy(() => import('@/pages/attestation/attestation-detail'));

const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'));
const CreateApplicationGridsIns = lazy(() => import('@/pages/applications/ui/create-application-grids-ins'));
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'));

// Auth pages
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'));
const OneIdLoginPage = lazy(() => import('@/pages/auth/ui/login-page'));

const StaffsPage = lazy(() => import('@/pages/admin/staffs/ui'));
const ReportsPage = lazy(() => import('@/features/reports/ui/reports'));
const ReportsDetail1 = lazy(() => import('@/features/reports/ui/report1'));
const ReportsDetail2 = lazy(() => import('@/features/reports/ui/report2'));
const ReportsDetail3 = lazy(() => import('@/features/reports/ui/report3'));
const RegionsPage = lazy(() => import('@/pages/admin/regions/ui'));
const DepartmentPage = lazy(() => import('@/pages/admin/department/ui'));
const TemplatesPage = lazy(() => import('@/pages/admin/templates/page'));
const EquipmentPage = lazy(() => import('@/pages/admin/equipment/equipment-page'));
const TemplateEditContentPage = lazy(() => import('@/pages/admin/templates/template-edit-content'));
const HazardousFacilitiesPage = lazy(() => import('@/pages/admin/hazardous-facility/ui'));
const RegisterPage = lazy(() => import('@/pages/register/ui'));
const RegisterHFDetail = lazy(() => import('@/features/register/hf/ui/hf-detail'));
const RegisterEquipmentDetail = lazy(() => import('@/features/register/equipments/ui/equipments-detail'));
const RegisterIrsDetail = lazy(() => import('@/features/register/irs/ui/irs-detail'));
const RiskAnalysisPage = lazy(() => import('@/pages/risk-analysis'));
const RiskAnalysisDetailPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-detail'));
const ChecklistTemplatesPage = lazy(() => import('@/pages/admin/checklist-templates/page'));
const UserLogsPage = lazy(() => import('@/pages/admin/user-logs/page'));
const ChecklistTemplatesPage2 = lazy(() => import('@/features/checklists'));
const PreventionsPage = lazy(() => import('@/pages/preventions'));
const PreventionCreatePage = lazy(() => import('@/pages/preventions/create'));
const PreventionViewPage = lazy(() => import('@/pages/preventions/view'));
const InspectionsInfoPage = lazy(() => import('@/features/inspections/ui/inspections.info.tsx'));
const InspectionsDetailPage = lazy(() => import('@/features/inspections/ui/inspections.detail.tsx'));
const InspectionsPage = lazy(() => import('@/pages/inspections/page'));
const AccreditationPage = lazy(() => import('@/pages/accreditations/page'));
const AttestationPage = lazy(() => import('@/pages/attestation'));
const CadastrePage = lazy(() => import('@/pages/cadastre'));
const AddAttestationEmployeePage = lazy(() => import('@/pages/attestation/add-employee'));
const AccreditationDetailPage = lazy(() => import('@/pages/accreditations/detail'));
const AccreditationConclusionsDetailPage = lazy(
  () => import('@/features/accreditation/ui/accreditation-conclusion-detail'),
);
const CadastreDetailPage = lazy(() => import('@/pages/cadastre/detail'));

export const appRoutes = [
  {
    path: 'applications',
    component: Applications,
    roles: [],
  },
  {
    path: 'applications/create',
    component: CreateApplicationGrids,
    roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL],
  },
  {
    path: 'applications/inspector/create',
    component: CreateApplicationGridsIns,
    roles: [UserRoles.INSPECTOR],
  },
  {
    path: 'reports',
    component: ReportsPage,
    roles: [],
  },
  {
    path: 'reports/create/REPORT_1',
    component: ReportsDetail1,
    roles: [],
  },
  {
    path: 'reports/create/REPORT_2',
    component: ReportsDetail2,
    roles: [],
  },
  {
    path: 'reports/create/REPORT_3',
    component: ReportsDetail3,
    roles: [],
  },
  {
    path: 'applications/create/:type',
    component: CreateApplicationForm,
    roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.INSPECTOR],
  },
  {
    path: 'applications/detail/:id',
    component: ApplicationDetail,
    roles: [],
  },
  {
    path: 'attestations/detail/:id',
    component: AttestationDetail,
    roles: [],
  },
  {
    path: 'register',
    component: RegisterPage,
    roles: [],
  },
  {
    path: 'cadastre',
    component: CadastrePage,
    roles: [],
  },
  {
    path: 'register/:id/hf',
    component: RegisterHFDetail,
    roles: [],
  },
  {
    path: 'register/:id/equipments',
    component: RegisterEquipmentDetail,
    roles: [],
  },
  {
    path: 'register/:id/irs',
    component: RegisterIrsDetail,
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
    path: 'templates',
    component: TemplatesPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'templates/:id',
    component: TemplateEditContentPage,
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
    path: 'checklist-templates',
    component: ChecklistTemplatesPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'user-logs',
    component: UserLogsPage,
    roles: [UserRoles.ADMIN],
  },
  {
    path: 'risk-analysis',
    component: RiskAnalysisPage,
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.MANAGER],
    roles: [],
  },
  {
    path: 'risk-analysis/detail',
    component: RiskAnalysisDetailPage,
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.MANAGER],
    roles: [],
  },
  {
    path: 'preventions',
    component: PreventionsPage,
    // roles: [
    //   UserRoles.LEGAL,
    //   UserRoles.HEAD,
    //   UserRoles.MANAGER,
    //   UserRoles.REGIONAL,
    //   UserRoles.INSPECTOR,
    //   UserRoles.INDIVIDUAL,
    // ],
    roles: [],
  },
  {
    path: 'preventions/create/:tin',
    component: PreventionCreatePage,
    roles: [UserRoles.INSPECTOR],
  },
  {
    path: 'preventions/view/:id',
    component: PreventionViewPage,
    // roles: [
    //   UserRoles.LEGAL,
    //   UserRoles.HEAD,
    //   UserRoles.MANAGER,
    //   UserRoles.REGIONAL,
    //   UserRoles.INSPECTOR,
    //   UserRoles.INDIVIDUAL,
    // ],
    roles: [],
  },
  {
    path: 'checklists',
    component: ChecklistTemplatesPage2,
    roles: [UserRoles.LEGAL],
  },
  {
    path: 'inspections',
    component: InspectionsPage,
    roles: [],
    // roles: [UserRoles.MANAGER, UserRoles.INSPECTOR, UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.REGIONAL],
  },
  {
    path: 'inspections/info',
    component: InspectionsInfoPage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.MANAGER],
  },
  {
    path: 'inspections/detail',
    component: InspectionsDetailPage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.MANAGER],
  },
  {
    path: 'accreditations',
    component: AccreditationPage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.MANAGER],
  },
  {
    path: 'attestations',
    component: AttestationPage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.MANAGER, UserRoles.INSPECTOR, UserRoles.REGIONAL],
  },
  {
    path: '/attestations/add',
    component: AddAttestationEmployeePage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL],
  },
  {
    path: '/accreditations/detail/:id',
    component: AccreditationDetailPage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.MANAGER],
  },
  {
    path: '/accreditations/conclusions/detail/:id',
    component: AccreditationConclusionsDetailPage,
    roles: [],
    // roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.MANAGER],
  },
  {
    path: '/cadastre/detail/:id',
    component: CadastreDetailPage,
    roles: [],
  },
];

export const authRoutes = [
  {
    path: 'login',
    component: OneIdLoginPage,
  },
  {
    path: 'login/admin',
    component: AdminLogin,
  },
];

export const specialComponents = {
  notFound: NotFound,
  unauthorized: UnAuthorized,
};
