export enum CraneType {
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

export enum ContainerType {
  Steam = 'Steam', // "Bug'li",
  AccumulatorCylinder = 'AccumulatorCylinder', // "Akkumlyator balloni",
  MobileVessel = 'MobileVessel', // "Harakatlanuvchi idish",
  AirCollector = 'AirCollector', // "Havo yig'gich",
  Receiver = 'Receiver', // "Qabul qiluvchi",
  Separator = 'Separator', // "Separator";
}

export enum LiftType {
  Hospital = 'Hospital', // "Kasalxonalar uchun",
  Freight = 'Freight', // "Yuk ko'taruvchi";
}
