import { Navigation } from '@/widgets/sidebar/models/types';

export default [
  {
    id: 'APPEAL',
    title: 'menu.applications',
    url: '/applications',
    icon: 'file-text',
  },
  {
    id: 'REGISTRY',
    title: 'menu.register',
    url: '/register',
    icon: 'database',
  },
  {
    id: 'RISK_ANALYSIS',
    title: 'menu.risk_analysis',
    url: '/risk-analysis',
    icon: 'alert-circle',
  },
  {
    id: 'INSPECTION',
    title: 'Tekshiruvlar',
    url: '/inspections',
    icon: 'clipboard',
  },
  {
    id: 'PREVENTION',
    title: 'Profilaktika',
    url: '/preventions',
    icon: 'shield-check',
  },
  {
    id: 'ACCREDITATION',
    title: 'menu.accreditation',
    url: '/accreditations',
    icon: 'check-circle',
  },
  {
    id: 'ATTESTATION_COMMITTEE',
    title: 'menu.attestation',
    url: '/attestations',
    icon: 'file-text',
  },
  {
    id: 'ATTESTATION_REGIONAL',
    title: 'menu.attestation',
    url: '/attestations',
    icon: 'file-text',
  },
  {
    id: 'CADASTRE',
    title: 'menu.cadastre',
    url: '/cadastre',
    icon: 'archive',
  },
  {
    id: 'REPORT',
    title: 'Hisobotlar',
    url: '/reports',
    icon: 'bar-chart-2',
  },
] as Navigation;
