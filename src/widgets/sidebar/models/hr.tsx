import { MODULE_ICONS } from './module-icons'
import { Navigation } from '@/widgets/sidebar/models/types'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')

export default [
  {
    id: 'KPI',
    title: 'KPI',
    url: '/kpi',
    icon: MODULE_ICONS.KPI,
    items: [
      {
        id: 'KPI',
        title: 'Boshqarma va bo‘limlar',
        url: '/kpi/departments',
      },
      {
        id: 'KPI',
        title: 'KPI vazifalar',
        url: '/kpi/tasks',
      },
    ],
  },
  {
    id: 'USER_DELEGATION',
    title: 'Vazifalarni yuklash',
    url: '/user-delegation',
    icon: MODULE_ICONS.USER_DELEGATION,
  },
  {
    id: 'TURNIKET_LOGS',
    title: 'Davomat (Kelish va ketish)',
    url: `/reports/turniket-logs?year=${currentYear}&month=${currentMonth}`,
    icon: MODULE_ICONS.TURNIKET_LOGS,
  },
] as Navigation
