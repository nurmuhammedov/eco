export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  LAPTOP = 'laptop',
  DESKTOP = 'desktop',
  LARGE_SCREEN = 'large-screen',
  QHD_2K = 'qhd-2k',
  UHD_4K = 'uhd-4k',
}

export enum ApplicationStatus {
  NEW = 'new',
  PROCESS = 'process',
  AGREEMENT = 'agreement',
  REJECTED = 'rejected',
  CONFIRMATION = 'confirmation',
}

export enum CraneTypes {
  Bridge = 'Bridge', // "Ko'prikli",
  Crawler = 'Crawler', // "O'zi sudralib yuruvchi",
  Funicular = 'Funicular', // "Funikulyar",
  Gantry = 'Gantry', // "Kozlovoy",
  Manipulator = 'Manipulator', // "Manipulyator",
  PipeLayer = 'PipeLayer', // "Truboukladchik";
  TireTrimmed = 'TireTrimmed', // "Pnevmoxodli",
  Tower = 'Tower', // "Minorali",
  Truck = 'Truck', //"Avtokran",
}
