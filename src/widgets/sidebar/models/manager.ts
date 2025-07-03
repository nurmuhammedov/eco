import { Navigation } from '@/widgets/sidebar/models/types';

export default [
  {
    title: 'menu.applications',
    url: '/applications',
    icon: 'note-text',
  },
  {
    title: 'menu.register',
    url: '/register',
    icon: 'external-drive',
  },
  {
    title: 'menu.risk_analysis',
    url: '/risk-analysis',
    icon: 'danger',
  },
  {
    title: 'Tekshiruvlar',
    url: '/inspections',
    icon: 'note-text',
  },
  {
    title: 'Profilaktika',
    url: '/preventions',
    icon: 'danger',
  },
  {
    title: 'menu.accreditation',
    url: '/accreditations',
    icon: 'danger',
  },
  {
    title: 'menu.attestation',
    url: '/attestations',
    icon: 'document',
  },
  {
    title: 'cadastre',
    url: '/cadastre',
    icon: 'document',
  },
] as Navigation;
