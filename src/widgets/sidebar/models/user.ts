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
    title: 'Profilaktika',
    url: '/preventions',
    icon: 'danger',
  },
  // {
  //   title: 'menu.accreditation',
  //   url: '/accreditation',
  //   icon: 'danger',
  // },
  // {
  //   title: 'menu.cadastre',
  //   url: '/cadastre',
  //   icon: 'box-search',
  // },
  // {
  //   title: 'menu.prophylactic',
  //   url: '/prophylactic',
  //   icon: 'direct-inbox',
  // },
  // {
  //   title: 'menu.attestation',
  //   url: '/attestation',
  //   icon: 'document',
  // },
  // {
  //   title: 'menu.monitoring',
  //   url: '/monitoring',
  //   icon: 'diagram',
  // },
  // {
  //   title: 'menu.reports',
  //   url: '/reports',
  //   icon: 'report',
  // },
] as Navigation;
