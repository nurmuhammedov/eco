import type { Navigation } from '@/widgets/sidebar/models/types'
import {
  Activity,
  AlertTriangle,
  Clipboard,
  ListChecks,
  ListTree,
  MapPin,
  MousePointerClick,
  Users,
} from 'lucide-react'

export default [
  {
    url: '/territories',
    title: 'menu.territories',
    icon: <MapPin />,
  },
  {
    url: '/department',
    title: 'menu.departments',
    icon: <ListTree />,
  },
  {
    url: '/staffs',
    title: 'menu.staffs',
    icon: <Users />,
  },
  {
    url: '/hazardous-facilities',
    title: 'menu.hazardous_facilities',
    icon: <AlertTriangle />,
  },
  {
    url: '/equipments',
    title: 'menu.sub_types',
    icon: <MousePointerClick />,
  },
  {
    url: '/attraction-types',
    title: 'Attraksion tipi',
    icon: <ListChecks />,
  },
  {
    url: '/inspection-surveys',
    title: 'menu.inspection',
    icon: <Clipboard />,
  },
  {
    url: '/user-logs',
    title: 'menu.user-logs',
    icon: <Activity />,
  },
] as Navigation
