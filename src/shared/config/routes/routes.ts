import { UserRoles } from '@/entities/user';
import { lazy } from 'react';

// Error pages
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'));
const UnAuthorized = lazy(() => import('@/features/auth/ui/unauthorized'));

// Application pages
const Applications = lazy(() => import('@/pages/applications/ui/application-page'));
const ApplicationDetail = lazy(() => import('@/pages/applications/ui/application-detail'));

const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'));
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'));

// Auth pages
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'));
const OneIdLoginPage = lazy(() => import('@/pages/auth/ui/login-page'));

const StaffsPage = lazy(() => import('@/pages/admin/staffs/ui'));
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

export const appRoutes = [
  {
    path: 'applications',
    component: Applications,
    roles: [],
  },
  {
    path: 'applications/create',
    component: CreateApplicationGrids,
    roles: [UserRoles.LEGAL],
  },
  {
    path: 'applications/create/:type',
    component: CreateApplicationForm,
    roles: [UserRoles.LEGAL],
  },
  {
    path: 'applications/detail/:id',
    component: ApplicationDetail,
    roles: [],
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
    path: 'risk-analysis',
    component: RiskAnalysisPage,
    roles: [UserRoles.LEGAL, UserRoles.INDIVIDUAL, UserRoles.REGIONAL, UserRoles.INSPECTOR],
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
