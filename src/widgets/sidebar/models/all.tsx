import { Navigation } from '@/widgets/sidebar/models/types'
import {
  Activity,
  Siren,
  BadgeCheck,
  BarChart2,
  Building2,
  ClipboardList,
  Database,
  FileBadge,
  FileCheck,
  FileText,
  MessageSquareText,
  ScrollText,
  ShieldCheck,
  ArrowDownUp,
  Archive,
  Newspaper,
  PieChart,
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
        url: '/inspections/risk-based',
      },
      {
        id: 'INSPECTION',
        title: 'Boshqa turdagi tekshiruvlar',
        url: '/inspections/other',
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
    id: 'ORGANIZATIONS',
    title: 'Tashkilotlar',
    url: '/organizations',
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
    icon: <BadgeCheck />,
  },
  {
    id: 'ATTESTATION_REGIONAL',
    title: 'menu.attestation',
    url: '/attestations',
    icon: <BadgeCheck />,
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
    url: '/inquiries',
    title: 'Murojaatlar',
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
  // KPI — HEAD va KPI_RESPONSIBLE foydalanuvchilar uchun
  {
    title: 'KPI',
    url: '/kpi',
    icon: <PieChart />,
    items: [
      {
        id: 'KPI_MY_TASKS',
        title: 'Mening KPIlarim',
        url: '/kpi/my-tasks',
      },
      {
        id: 'KPI_REPORT',
        title: 'KPI Hisoboti',
        url: '/kpi/report',
      },
    ],
  },
  {
    title: 'Attestatsiya',
    url: '/attestation',
    icon: <BadgeCheck />,
    items: [
      {
        id: 'ATTESTATION_DIRECTIONS',
        title: "Yo'nalishlar",
        url: '/attestation-directions',
      },
      {
        id: 'ATTESTATION_QUESTIONS',
        title: 'Imtihon savollari',
        url: '/attestation-questions',
      },
    ],
  },
] as Navigation
