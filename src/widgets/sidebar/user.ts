import { Navigation } from '@/widgets/models';

// ** Icons
import {
  ApplicationsIcon,
  AttestationIcon,
  MonitoringIcon,
  ProphylacticIcon,
  RegistryIcon,
  ReportIcon,
  RiskAnalysisIcon,
  StateReception,
} from '@/shared/components/SVGIcons.tsx';

export default [
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
    title: 'menu.accreditation',
    url: '/app/accreditation',
    icon: RiskAnalysisIcon,
  },
  {
    title: 'menu.cadastre',
    url: '/app/cadastre',
    icon: ProphylacticIcon,
  },
  {
    title: 'menu.prophylactic',
    url: '/app/prophylactic',
    icon: StateReception,
  },
  {
    title: 'menu.attestation',
    url: '/app/attestation',
    icon: AttestationIcon,
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
