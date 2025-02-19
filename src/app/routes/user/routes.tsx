import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const Applications = lazy(() => import('@/pages/user/applications'));
const ApplicationCreate = lazy(
  () => import('@/pages/user/applications/create-application'),
);
const Register = lazy(() => import('@/features/user/register/pages'));
const RiskAnalysis = lazy(() => import('@/features/user/risk-analysis/pages'));
const Prophylactic = lazy(() => import('@/features/user/prophylactic/pages'));
const Monitoring = lazy(() => import('@/features/user/monitoring/pages'));
const Reports = lazy(() => import('@/features/user/reports/pages'));
const Attestation = lazy(() => import('@/features/user/attestation/pages'));
const StateReception = lazy(
  () => import('@/features/user/state-reception/pages'),
);

export default [
  {
    path: 'applications',
    element: <Applications />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'applications/create',
    element: <ApplicationCreate />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'register',
    element: <Register />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'accreditation',
    element: <RiskAnalysis />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'cadastre',
    element: <Prophylactic />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'prophylactic',
    element: <Prophylactic />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'attestation',
    element: <Attestation />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'state-reception',
    element: <StateReception />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'monitoring',
    element: <Monitoring />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
  {
    path: 'reports',
    element: <Reports />,
    meta: {
      restricted: true,
      roles: [UserRoles.LEGAL],
    },
  },
];
