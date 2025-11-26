import { Navigation } from '@/widgets/sidebar/models/types';
import {
  FileText,
  Database,
  AlertCircle,
  Clipboard,
  ShieldCheck,
  CheckCircle,
  Archive,
  BarChart2,
  Award,
} from 'lucide-react';

export default [
  {
    id: 'APPEAL',
    title: 'menu.applications',
    url: '/applications',
    icon: <FileText />,
  },
  {
    id: 'REGISTRY',
    title: 'menu.register',
    url: '/register',
    icon: <Database />,
  },
  {
    id: 'PREVENTION',
    title: 'Profilaktika',
    url: '/preventions',
    icon: <ShieldCheck />,
  },
  {
    id: 'RISK_ANALYSIS',
    title: 'menu.risk_analysis',
    url: '/risk-analysis',
    icon: <AlertCircle />,
  },
  {
    id: 'INSPECTION',
    title: 'Tekshiruvlar',
    url: '/inspections',
    icon: <Clipboard />,
  },
  {
    id: 'ACCREDITATION',
    title: 'menu.accreditation',
    url: '/accreditations',
    icon: <CheckCircle />,
    items: [
      {
        url: '/accreditations',
        title: 'Ekpertiza xulosalari',
      },
    ],
  },
  {
    id: 'ATTESTATION_COMMITTEE',
    title: 'menu.attestation',
    url: '/attestations',
    icon: <FileText />,
  },
  {
    id: 'ATTESTATION_REGIONAL',
    title: 'menu.attestation',
    url: '/attestations',
    icon: <FileText />,
  },
  {
    id: 'CADASTRE',
    title: 'menu.cadastre',
    url: '/cadastre',
    icon: <Archive />,
  },
  {
    id: 'REPORT',
    title: 'Hisobotlar',
    url: '/reports',
    icon: <BarChart2 />,
  },
  {
    id: 'PERMITS',
    title: 'Ruxsat etuvchi hujjatlar',
    url: '/permits',
    icon: <Award />,
  },
] as Navigation;
