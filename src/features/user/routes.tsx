import { UserRoles } from '@/entities/user';
import { lazy } from 'react';

const Applications = lazy(() => import('./applications/ui'));
const Register = lazy(() => import('./register/pages'));
const RiskAnalysis = lazy(() => import('./risk-analysis/pages'));
const Prophylactic = lazy(() => import('./prophylactic/pages'));
const Monitoring = lazy(() => import('./monitoring/pages'));
const Reports = lazy(() => import('./reports/pages'));
const Attestation = lazy(() => import('./attestation/pages'));
const StateReception = lazy(() => import('./state-reception/pages'));

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
