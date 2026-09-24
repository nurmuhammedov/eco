import { MODULE_ICONS } from './module-icons'
import { Navigation } from '@/widgets/sidebar/models/types'

export default [
  {
    id: 'APPEAL',
    title: 'menu.applications',
    url: '/applications',
    icon: MODULE_ICONS.APPEAL,
  },
  {
    id: 'REGISTRY',
    title: 'menu.register',
    url: '/register',
    icon: MODULE_ICONS.REGISTRY,
  },
  {
    id: 'ELEVATOR',
    title: 'menu.elevators',
    url: '/elevators',
    icon: MODULE_ICONS.ELEVATOR,
  },
  {
    id: 'PREVENTION',
    title: 'Profilaktika',
    url: '/preventions',
    icon: MODULE_ICONS.PREVENTION,
  },
  {
    id: 'RISK_ANALYSIS',
    title: 'menu.risk_analysis',
    url: '/risk-analysis',
    icon: MODULE_ICONS.RISK_ANALYSIS,
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
    icon: MODULE_ICONS.INSPECTION,
    items: [
      {
        id: 'INSPECTION',
        title: 'Xavf tahlili asosidagi tekshiruvlar',
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
    icon: MODULE_ICONS.ACCREDITATION,
  },
  {
    id: 'CONCLUSION',
    title: 'Ekspertiza xulosalari',
    url: '/accreditations',
    icon: MODULE_ICONS.CONCLUSION,
  },
  {
    id: 'DECLARATION',
    title: 'Deklaratsiya',
    url: '/declarations',
    icon: MODULE_ICONS.DECLARATION,
  },
  {
    id: 'REPORT',
    title: 'Hisobotlar',
    url: '/reports',
    icon: MODULE_ICONS.REPORT,
  },
  {
    id: 'PERMITS',
    title: 'Ruxsat etuvchi hujjatlar',
    url: '/permits',
    icon: MODULE_ICONS.PERMITS,
  },
  {
    id: 'INQUIRY',
    title: 'Murojaatlar',
    url: '/inquiries',
    icon: MODULE_ICONS.INQUIRY,
  },
  {
    id: 'ACCIDENT',
    title: 'Baxtsiz hodisalar va Avariyalar',
    url: '/accidents',
    icon: MODULE_ICONS.ACCIDENT,
  },
  {
    id: 'ANNOUNCEMENT',
    title: 'Xabarnoma',
    url: '/news',
    icon: MODULE_ICONS.ANNOUNCEMENT,
  },
  {
    id: 'ARCHIVE',
    title: 'Arxiv',
    url: '/archive',
    icon: MODULE_ICONS.ARCHIVE,
  },
  {
    id: 'CADASTRE_PASSPORT',
    title: 'TXYUZ kadastr pasportlari',
    url: '/cadastre-passports',
    icon: MODULE_ICONS.CADASTRE_PASSPORT,
  },
  {
    id: 'ATTESTATION',
    title: 'Attestatsiya',
    url: '/attestation/applications',
    icon: MODULE_ICONS.ATTESTATION,
  },
] as Navigation
