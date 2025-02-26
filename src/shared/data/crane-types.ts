import { CraneTypes } from '@/shared/types/enums';

export const CRANE_TYPES = [
  {
    value: CraneTypes.Bridge,
    label: "Ko'prikli",
  },
  {
    value: CraneTypes.Crawler,
    label: "O'zi sudralib yuruvchi",
  },
  {
    value: CraneTypes.Funicular,
    label: 'Funikulyar',
  },
  {
    value: CraneTypes.Gantry,
    label: 'Kozlovoy',
  },
  {
    value: CraneTypes.Manipulator,
    label: 'Manipulyator',
  },
  {
    value: CraneTypes.PipeLayer,
    label: 'Truboukladchik',
  },
  {
    value: CraneTypes.TireTrimmed,
    label: 'Pnevmoxodli',
  },
  {
    value: CraneTypes.Tower,
    label: 'Minorali',
  },
  {
    value: CraneTypes.Truck,
    label: 'Avtokran',
  },
];
