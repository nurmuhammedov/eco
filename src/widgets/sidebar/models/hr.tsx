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
        id: 'KPI_DEPARTMENTS',
        title: 'Boshqarma va bo‘limlar',
        url: '/kpi/departments',
      },
      {
        id: 'KPI_TASKS',
        title: 'KPI vazifalar',
        url: '/kpi/tasks',
      },
      {
        id: 'KPI_MY_TASKS',
        title: 'Mening KPIlarim',
        url: '/kpi/my-tasks',
      },
      {
        id: 'KPI_REPORT',
        title: 'KPI hisoboti',
        url: '/kpi/report',
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
