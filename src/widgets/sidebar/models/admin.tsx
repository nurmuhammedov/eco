import type { Navigation } from '@/widgets/sidebar/models/types'
import {
  Activity,
  AlertTriangle,
  Clipboard,
  Cog,
  ListTree,
  MapPin,
  Shapes,
  Users,
  Signature,
  Mail,
  Building2,
  // Server,
  Trees,
  // ArrowDownUp,
  Newspaper,
} from 'lucide-react'

export default [
  {
    url: '/territories',
    title: 'menu.territories',
    icon: <MapPin />,
  },
  {
    id: 'ORGANIZATIONS',
    title: 'Tashkilotlar',
    url: '/organizations',
    icon: <Building2 />,
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
    url: '/decree-signers',
    title: 'Imzolovchi shaxslar',
    icon: <Signature />,
  },
  {
    url: '/hazardous-facilities',
    title: 'menu.hazardous_facilities',
    icon: <AlertTriangle />,
  },
  {
    url: '/equipments',
    title: 'menu.sub_types',
    icon: <Cog />,
  },
  {
    url: '/attraction-types',
    title: 'Attraksion tipi',
    icon: <Shapes />,
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
  {
    url: '/hybrid-mail',
    title: 'Gibrid pochta',
    icon: <Mail />,
  },
  {
    url: '/parks',
    title: 'Park va maskanlar',
    icon: <Trees />,
  },
  // {
  //   url: '/metrics/',
  //   title: 'Server ko‘rsatgichlari',
  //   icon: <Server />,
  // },
  // {
  //   id: 'ELEVATOR',
  //   url: '/elevators',
  //   title: 'menu.elevators',
  //   icon: <ArrowDownUp />,
  // },
  {
    id: 'ANNOUNCEMENT',
    url: '/news',
    title: 'Xabarnoma',
    icon: <Newspaper />,
  },
] as Navigation
