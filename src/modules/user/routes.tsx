import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const Appeals = lazy(() => import('./appeals/pages'));
const Applications = lazy(() => import('./applications/pages'));
const Register = lazy(() => import('./register/pages'));
const RiskAnalysis = lazy(() => import('./risk-analysis/pages'));
const Prophylactic = lazy(() => import('./prophylactic/pages'));
const Monitoring = lazy(() => import('./monitoring/pages'));
const Reports = lazy(() => import('./reports/pages'));
const Attestation = lazy(() => import('./attestation/pages'));
const StateReception = lazy(() => import('./state-reception/pages'));

export default [
  {
    path: 'appeals',
    element: <Appeals />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'applications',
    element: <Applications />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'register',
    element: <Register />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'accreditation',
    element: <RiskAnalysis />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'cadastre',
    element: <Prophylactic />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'prophylactic',
    element: <Prophylactic />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'attestation',
    element: <Attestation />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'state-reception',
    element: <StateReception />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'monitoring',
    element: <Monitoring />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
  {
    path: 'reports',
    element: <Reports />,
    meta: {
      restricted: true,
      roles: [UserRoles.USER],
    },
  },
];
