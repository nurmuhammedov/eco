import { MODULE_ICONS } from './module-icons'
import { Navigation } from '@/widgets/sidebar/model/types'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')

export default [
  {
    id: 'DELEGATION',
    title: 'Vazifalarni yuklash',
    url: '/user-delegation',
    icon: MODULE_ICONS.DELEGATION,
  },
  {
    id: 'TURNIKET_LOGS',
    title: 'Davomat (Kelish va ketish)',
    url: `/reports/turniket-logs?year=${currentYear}&month=${currentMonth}`,
    icon: MODULE_ICONS.TURNIKET_LOGS,
  },
] as Navigation
