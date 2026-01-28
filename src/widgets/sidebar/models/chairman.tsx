import { Navigation } from '@/widgets/sidebar/models/types'
import {
  Activity,
  BadgeCheck,
  BarChart2,
  CheckCircle,
  ClipboardList,
  Database,
  FileBadge,
  FileText,
  Map,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react'

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
    icon: <Activity />,
  },
  {
    id: 'INSPECTION',
    title: 'Tekshiruvlar',
    url: '/inspections',
    icon: <ClipboardList />,
  },
  {
    id: 'ACCREDITATION',
    title: 'menu.accreditation',
    url: '/expertise-organizations',
    icon: <CheckCircle />,
    items: [
      {
        url: '/expertise-organizations',
        title: 'Ekpertiza tashkilotlari',
      },
      {
        url: '/accreditations',
        title: 'Ekpertiza xulosalari',
      },
      {
        url: '/declarations',
        title: 'Deklaratsiya',
      },
    ],
  },
  {
    id: 'ATTESTATION_COMMITTEE',
    title: 'menu.attestation',
    url: '/attestations',
    icon: <BadgeCheck />,
  },
  {
    id: 'ATTESTATION_REGIONAL',
    title: 'menu.attestation',
    url: '/attestations',
    icon: <BadgeCheck />,
  },
  {
    id: 'CADASTRE',
    title: 'menu.cadastre',
    url: '/cadastre',
    icon: <Map />,
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
    icon: <FileBadge />,
  },
  {
    id: 'INQUIRY',
    title: 'Murojaatlar',
    url: '/inquiries',
    icon: <MessageSquareText />,
  },
] as Navigation
