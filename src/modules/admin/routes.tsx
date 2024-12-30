import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const Appeals = lazy(() => import('./appeals/pages/appeals'));
const Applications = lazy(() => import('./applications/pages/applications'));
const Register = lazy(() => import('./register/pages/register'));
const RiskAnalysis = lazy(() => import('./risk-analysis/pages/risk-analysis'));
const Prophylactic = lazy(() => import('./prophylactic/pages/prophylactic'));
const Monitoring = lazy(() => import('./monitoring/pages/monitoring'));
const Reports = lazy(() => import('./reports/pages/reports'));
const Attestation = lazy(() => import('./attestation/pages/attestation'));
const StateReception = lazy(
  () => import('./state-reception/pages/state-reception'),
);

export default [
  {
    path: '',
    element: <Appeals />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'applications',
    element: <Applications />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'register',
    element: <Register />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'risk-analysis',
    element: <RiskAnalysis />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'prophylactic',
    element: <Prophylactic />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'attestation',
    element: <Attestation />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'state-reception',
    element: <StateReception />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'monitoring',
    element: <Monitoring />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: 'reports',
    element: <Reports />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
];
