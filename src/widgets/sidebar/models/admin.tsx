import { ListTree, MapPinned, Users } from 'lucide-react';
import type { Navigation } from '@/widgets/sidebar/models/types';

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
] as Navigation;
