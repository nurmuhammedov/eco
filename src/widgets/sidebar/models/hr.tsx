import { Navigation } from '@/widgets/sidebar/models/types'
import { PieChart, UsersRound, CalendarClock } from 'lucide-react'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')

export default [
  {
    id: 'KPI',
    title: 'KPI',
    url: '/kpi',
    icon: <PieChart />,
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
    icon: <UsersRound />,
  },
  {
    id: 'TURNIKET_LOGS',
    title: 'Davomat (Kelish va ketish)',
    url: `/reports/turniket-logs?year=${currentYear}&month=${currentMonth}`,
    icon: <CalendarClock />,
  },
] as Navigation
