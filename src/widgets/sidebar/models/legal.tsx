import { Navigation } from '@/widgets/sidebar/models/types'
import {
  AlertCircle,
  Ambulance,
  Archive,
  Award,
  BarChart2,
  Building2,
  Clipboard,
  Database,
  FileCheck,
  FileText,
  MessageSquareText,
  ScrollText,
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
    title: 'Ekspert tashkilotlar',
    url: '/expertise-organizations',
    icon: <Building2 />,
  },
  {
    id: 'CONCLUSION',
    title: 'Ekspertiza xulosalari',
    url: '/accreditations',
    icon: <FileCheck />,
  },
  {
    id: 'DECLARATION',
    title: 'Deklaratsiya',
    url: '/declarations',
    icon: <ScrollText />,
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
  {
    id: 'INQUIRY',
    title: 'Murojaatlar',
    url: '/inquiries',
    icon: <MessageSquareText />,
  },
  {
    id: 'ACCIDENT',
    title: 'Baxtsiz hod. va Avariyalar',
    url: '/accidents',
    icon: <Ambulance />,
  },
] as Navigation
