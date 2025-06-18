import type { Navigation } from '@/widgets/sidebar/models/types';
import {
  ListChecks,
  ListTree,
  LucideMousePointerSquareDashed,
  MapPinned,
  PencilRuler,
  ToyBrick,
  Users,
} from 'lucide-react';

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
  {
    url: '/attraction-types',
    title: 'Attraksion tipi',
    icon: <ToyBrick />,
  },
  {
    url: '/checklist-templates',
    title: 'menu.checklist_templates',
    icon: <ListChecks />,
  },
] as Navigation;
