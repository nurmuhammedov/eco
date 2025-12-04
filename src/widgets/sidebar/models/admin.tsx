import type { Navigation } from '@/widgets/sidebar/models/types'
import {
  ListChecks,
  ListTree,
  MapPin,
  PencilRuler,
  MousePointerClick,
  Users,
  Clipboard,
  Activity,
  AlertTriangle,
  Award,
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
    url: '/templates',
    title: 'menu.templates',
    icon: <PencilRuler />,
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
    url: '/permits',
    title: 'Ruxsatnomalar',
    icon: <Award />,
  },
  // {
  //   url: '/checklist-templates',
  //   title: 'menu.checklist_templates',
  //   icon: <ListChecks />,
  // },
  {
    url: '/user-logs',
    title: 'menu.user-logs',
    icon: <Activity />,
  },
] as Navigation
