import { UserRoles } from '@/entities/user';
import AttractionTypePage from '@/pages/admin/attraction-type/page';
import { lazy } from 'react';

// Error pages
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'));
// const UnAuthorized = lazy(() => import('@/features/auth/ui/unauthorized'));

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
const RegisterEquipmentAppealList = lazy(() => import('@/features/register/equipments/ui/equipments-appeal-list'));
const EquipmentPrintPage = lazy(() => import('@/features/register/equipments/ui/EquipmentPrintPage'));
const RegisterIrsDetail = lazy(() => import('@/features/register/irs/ui/irs-detail'));
const RegisterXrayDetail = lazy(() => import('@/features/register/xray/ui/xray-detail'));
const RiskAnalysisPage = lazy(() => import('@/pages/risk-analysis'));
const RiskAnalysisDetailPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-detail'));
const RiskAnalysisDetailInfoPage = lazy(() => import('@/features/risk-analysis/ui/risk-analysis-info-by-id'));
const ChecklistTemplatesPage = lazy(() => import('@/pages/admin/checklist-templates/page'));
const UserLogsPage = lazy(() => import('@/pages/admin/user-logs/page'));
const ChecklistTemplatesPage2 = lazy(() => import('@/features/checklists'));
const PreventionsPage = lazy(() => import('@/pages/preventions'));
const PreventionCreatePage = lazy(() => import('@/pages/preventions/create'));
const PreventionViewPage = lazy(() => import('@/pages/preventions/view'));
const InspectionsInfoPage = lazy(() => import('@/features/inspections/ui/inspections.info.tsx'));
const InspectionsDetailPage = lazy(() => import('@/features/inspections/ui/inspections.detail.tsx'));
const InspectionsPage = lazy(() => import('@/pages/inspections/page'));
const InspectionSurveys = lazy(() => import('@/pages/admin/inspection/ui'));
const AccreditationPage = lazy(() => import('@/pages/accreditations/page'));
const AttestationPage = lazy(() => import('@/pages/attestation'));
const InspectorTasks = lazy(() => import('@/features/risk-analysis/ui/inspector-tasks'));
const CadastrePage = lazy(() => import('@/pages/cadastre'));
const AddAttestationEmployeePage = lazy(() => import('@/pages/attestation/add-employee'));
const AccreditationDetailPage = lazy(() => import('@/pages/accreditations/detail'));
const AccreditationConclusionsDetailPage = lazy(
  () => import('@/features/accreditation/ui/accreditation-conclusion-detail'),
);
const CadastreDetailPage = lazy(() => import('@/pages/cadastre/detail'));
const ContactPage = lazy(() => import('@/pages/qr-form'));

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
    path: 'risk-analysis/my-tasks',
    component: InspectorTasks,
    roles: [UserRoles.INSPECTOR],
  },
  {
    path: 'applications/inspector/create',
    component: CreateApplicationGridsIns,
    roles: [UserRoles.INSPECTOR, UserRoles.MANAGER],
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
    roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.INSPECTOR, UserRoles.MANAGER],
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
    path: 'register/:id/equipments/appeal',
    component: RegisterEquipmentAppealList,
    roles: [],
  },
  {
    path: 'register/:id/qr-page',
    component: EquipmentPrintPage,
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
    roles: [],
  },
  {
    path: 'risk-analysis/detail',
    component: RiskAnalysisDetailPage,
    roles: [],
  },
  {
    path: 'risk-analysis/info/:id',
    component: RiskAnalysisDetailInfoPage,
    roles: [],
  },
  {
    path: 'preventions',
    component: PreventionsPage,
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
  },
  {
    path: 'inspections/info',
    component: InspectionsInfoPage,
    roles: [],
  },
  {
    path: 'inspections/detail',
    component: InspectionsDetailPage,
    roles: [],
  },
  {
    path: 'accreditations',
    component: AccreditationPage,
    roles: [],
  },
  {
    path: 'attestations',
    component: AttestationPage,
    roles: [],
  },
  {
    path: '/attestations/add',
    component: AddAttestationEmployeePage,
    roles: [],
  },
  {
    path: '/accreditations/detail/:id',
    component: AccreditationDetailPage,
    roles: [],
  },
  {
    path: '/accreditations/conclusions/detail/:id',
    component: AccreditationConclusionsDetailPage,
    roles: [],
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
    roles: [],
  },
  {
    path: 'login/admin',
    roles: [],
    component: AdminLogin,
  },
];

export const publicRoutes = [
  {
    path: '/qr/:id/equipments',
    component: ContactPage,
  },
];

export const specialComponents = {
  notFound: NotFound,
  // unauthorized: UnAuthorized,
};
