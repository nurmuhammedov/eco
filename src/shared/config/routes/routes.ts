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
    component: Applications,
    roles: [UserRoles.LEGAL, UserRoles.REGIONAL],
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
