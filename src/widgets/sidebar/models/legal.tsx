import { Navigation } from '@/widgets/sidebar/models/types'
import {
  Activity,
  Archive,
  ArrowDownUp,
  Award,
  BarChart2,
  Building2,
  ClipboardList,
  Database,
  FileCheck,
  FileText,
  MessageSquareText,
  Newspaper,
  ScrollText,
  ShieldCheck,
  Siren,
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
    id: 'ELEVATOR',
    title: 'menu.elevators',
    url: '/elevators',
    icon: <ArrowDownUp />,
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
    items: [
      {
        id: 'RISK_ANALYSIS',
        url: '/risk-analysis/monthly',
        title: 'Oylik xavf tahlili',
      },
      {
        id: 'RISK_ANALYSIS',
        url: '/risk-analysis/daily',
        title: 'Kunlik xavf tahlili',
      },
    ],
  },
  {
    id: 'INSPECTION',
    title: 'Tekshiruvlar',
    url: '/inspections',
    icon: <ClipboardList />,
    items: [
      {
        id: 'INSPECTION',
        title: 'Xavfni tahlili asosidagi tekshiruvlar',
        url: '/inspections?type=RISK_BASED',
      },
      {
        id: 'INSPECTION',
        title: 'Boshqa turdagi tekshiruvlar',
        url: '/inspections?type=OTHER',
      },
    ],
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
    icon: <Siren />,
  },
  {
    id: 'ANNOUNCEMENT',
    title: 'Xabarnoma',
    url: '/news',
    icon: <Newspaper />,
  },
  {
    id: 'ARCHIVE',
    title: 'Arxiv',
    url: '/archive',
    icon: <Archive />,
  },
  {
    id: 'CADASTRE_PASSPORT',
    title: 'TXYZ Kadastr',
    url: '/cadastre-passport',
    icon: <FileCheck />,
  },
] as Navigation
