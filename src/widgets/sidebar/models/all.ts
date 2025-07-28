import { Navigation } from '@/widgets/sidebar/models/types';

export default [
  {
    id: 'APPEAL',
    title: 'menu.applications',
    url: '/applications',
    icon: 'note-text',
  },
  {
    id: 'REGISTRY',
    title: 'menu.register',
    url: '/register',
    icon: 'external-drive',
  },
  {
    id: 'RISK_ANALYSIS',
    title: 'menu.risk_analysis',
    url: '/risk-analysis',
    icon: 'danger',
  },
  {
    id: 'INSPECTION',
    title: 'Tekshiruvlar',
    url: '/inspections',
    icon: 'note-text',
  },
  {
    id: 'PREVENTION',
    title: 'Profilaktika',
    url: '/preventions',
    icon: 'danger',
  },
  {
    id: 'ACCREDITATION',
    title: 'menu.accreditation',
    url: '/accreditations',
    icon: 'danger',
  },
  {
    id: 'ATTESTATION_COMMITTEE',
    title: 'menu.attestation',
    url: '/attestations',
    icon: 'document',
  },
  {
    id: 'ATTESTATION_REGIONAL',
    title: 'menu.attestation',
    url: '/attestations',
    icon: 'document',
  },
  {
    id: 'CADASTRE',
    title: 'menu.cadastre',
    url: '/cadastre',
    icon: 'box-search',
  },
] as Navigation;
