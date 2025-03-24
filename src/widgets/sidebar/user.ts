import { Navigation } from 'src/widgets/sidebar/models';

// ** Icons

export default [
  {
    title: 'menu.applications',
    url: '/app/applications',
    icon: 'note-text',
  },
  {
    title: 'menu.register',
    url: '/app/register',
    icon: 'external-drive',
  },
  {
    title: 'menu.accreditation',
    url: '/app/accreditation',
    icon: 'danger',
  },
  {
    title: 'menu.cadastre',
    url: '/app/cadastre',
    icon: 'box-search',
  },
  {
    title: 'menu.prophylactic',
    url: '/app/prophylactic',
    icon: 'direct-inbox',
  },
  {
    title: 'menu.attestation',
    url: '/app/attestation',
    icon: 'document',
  },
  {
    title: 'menu.monitoring',
    url: '/app/monitoring',
    icon: 'diagram',
  },
  {
    title: 'menu.reports',
    url: '/app/reports',
    icon: 'report',
  },
] as Navigation;
