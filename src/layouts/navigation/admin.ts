// ** Types
import type { Navigation } from '@/layouts/types';

// ** UI components
import {
  AppealsIcon,
  ApplicationsIcon,
  AttestationIcon,
  MonitoringIcon,
  ProphylacticIcon,
  RegistryIcon,
  ReportIcon,
  RiskAnalysisIcon,
  StateReception,
} from '@/shared/components/SVGIcons';

export default [
  {
    title: 'menu.appeals',
    url: '/app',
    icon: AppealsIcon,
  },
  {
    title: 'menu.applications',
    url: '/app/applications',
    icon: ApplicationsIcon,
  },
  {
    title: 'menu.register',
    url: '/app/register',
    icon: RegistryIcon,
  },
  {
    title: 'menu.risk_analysis',
    url: '/app/risk-analysis',
    icon: RiskAnalysisIcon,
  },
  {
    title: 'menu.prophylactic',
    url: '/app/prophylactic',
    icon: ProphylacticIcon,
  },
  {
    title: 'menu.attestation',
    url: '/app/attestation',
    icon: AttestationIcon,
  },
  {
    title: 'menu.state_reception',
    url: '/app/state-reception',
    icon: StateReception,
  },
  {
    title: 'menu.monitoring',
    url: '/app/monitoring',
    icon: MonitoringIcon,
  },
  {
    title: 'menu.reports',
    url: '/app/reports',
    icon: ReportIcon,
  },
] as Navigation;
