import type { Navigation } from '@/widgets/sidebar/models/types';
import { ListTree, LucideMousePointerSquareDashed, MapPinned, PencilRuler, Users } from 'lucide-react';

export default [
  {
    url: '/territories',
    title: 'menu.territories',
    icon: <MapPinned />,
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
    icon: <Users />,
  },
  {
    url: '/templates',
    title: 'menu.templates',
    icon: <PencilRuler />,
  },
  {
    url: '/equipments',
    title: 'menu.sub_types',
    icon: <LucideMousePointerSquareDashed />,
  },
] as Navigation;
