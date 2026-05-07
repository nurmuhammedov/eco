import { Navigation } from '@/widgets/sidebar/models/types'
import { Database, Newspaper } from 'lucide-react'

export default [
  {
    title: 'menu.register',
    url: '/register',
    icon: <Database />,
  },
  {
    id: 'ANNOUNCEMENT',
    title: 'Xabarnoma',
    url: '/news',
    icon: <Newspaper />,
  },
] as Navigation
