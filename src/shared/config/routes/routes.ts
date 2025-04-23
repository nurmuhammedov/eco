import { lazy } from 'react';
import { UserRoles } from '@/entities/user';

// Error pages
const NotFound = lazy(() => import('@/pages/error/ui/page-not-found'));
const UnAuthorized = lazy(() => import('@/features/auth/ui/unauthorized'));

// Application pages
const Applications = lazy(() => import('@/pages/applications/ui/application-page'));

const CreateApplicationGrids = lazy(() => import('@/pages/applications/ui/create-application-grids'));
const CreateApplicationForm = lazy(() => import('@/pages/applications/ui/create-application-form'));

// Auth pages
const Login = lazy(() => import('@/pages/auth/ui/login-page'));
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'));

const Register = lazy(() => import('@/features/user/register/pages'));
const StaffsPage = lazy(() => import('@/pages/admin/staffs/ui'));
const RegionsPage = lazy(() => import('@/pages/admin/regions/ui'));
const DepartmentPage = lazy(() => import('@/pages/admin/department/ui'));
const TemplatesPage = lazy(() => import('@/pages/admin/templates/page'));
const TemplateEditorPage = lazy(() => import('@/pages/admin/templates/editor-page'));
const HazardousFacilitiesPage = lazy(() => import('@/pages/admin/hazardous-facility/ui'));

export const appRoutes = [
  {
    path: 'applications',
    component: Applications,
    roles: [UserRoles.LEGAL],
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
    path: 'register',
    component: Register,
    roles: [UserRoles.LEGAL],
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
    component: TemplateEditorPage,
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
];

export const authRoutes = [
  {
    path: 'login',
    component: Login,
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
