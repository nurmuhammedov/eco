import { Navigation } from '@/widgets/sidebar/models/types'
import { Database } from 'lucide-react'

export default [
  {
    id: 'REGISTRY',
    title: 'menu.register',
    url: '/register',
    icon: <Database />,
  },
] as Navigation
