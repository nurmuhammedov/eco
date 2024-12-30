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
    title: 'Murojaatlar',
    url: '/app',
    icon: AppealsIcon,
  },
  {
    title: 'Arizalar',
    url: '/app/applications',
    icon: ApplicationsIcon,
  },
  {
    title: 'Reestr',
    url: '/app/register',
    icon: RegistryIcon,
  },
  {
    title: 'Xavf tahlili',
    url: '/app/risk-analysis',
    icon: RiskAnalysisIcon,
  },
  {
    title: 'Profilaktika',
    url: '/app/prophylactic',
    icon: ProphylacticIcon,
  },
  {
    title: 'Attestatsiya',
    url: '/app/attestation',
    icon: AttestationIcon,
  },
  {
    title: 'Davlat qabuli',
    url: '/app/state-reception',
    icon: StateReception,
  },
  {
    title: 'Monitoring',
    url: '/app/monitoring',
    icon: MonitoringIcon,
  },
  {
    title: 'Hisobot',
    url: '/app/reports',
    icon: ReportIcon,
  },
] as Navigation;
