export interface EquipmentConfig {
  id: string
  key: string
  title: string
  addLabel: string
  apiEndpoint: string
}

export const EQUIPMENT_CONFIG: EquipmentConfig[] = [
  {
    id: 'crane',
    key: 'crane',
    title: 'Kran',
    apiEndpoint: '/api/cranes',
    addLabel: "Kran qo'shish",
  },
  {
    id: 'vessel',
    key: 'vessel',
    title: 'Idish',
    apiEndpoint: '/api/vessels',
    addLabel: "Idish qo'shish",
  },
  {
    id: 'cauldron',
    key: 'cauldron',
    title: 'Qozon',
    apiEndpoint: '/api/cauldrons',
    addLabel: "Qozon qo'shish",
  },
  {
    id: 'elevator',
    key: 'elevator',
    title: 'Lift',
    apiEndpoint: '/api/elevators',
    addLabel: "Lift qo'shish",
  },
  {
    id: 'escalator',
    key: 'escalator',
    title: 'Эскалатор',
    apiEndpoint: '/api/escalators',
    addLabel: 'Эскалатор қўшиш',
  },
  {
    id: 'lift',
    key: 'lift',
    title: 'Қўтаргич',
    apiEndpoint: '/api/lifts',
    addLabel: 'Қўтаргич қўшиш',
  },
  {
    id: 'conveyor',
    key: 'conveyor',
    title: 'Kувур',
    apiEndpoint: '/api/conveyors',
    addLabel: 'Kувур қўшиш',
  },
  {
    id: 'axis',
    key: 'axis',
    title: 'Осма йўл',
    apiEndpoint: '/api/axes',
    addLabel: 'Осма йўл қўшиш',
  },
  {
    id: 'attraction',
    key: 'attraction',
    title: 'Аттракцион',
    apiEndpoint: '/api/attractions',
    addLabel: 'Аттракцион қўшиш',
  },
  {
    id: 'boiler',
    key: 'boiler',
    title: 'Котел утилизатор',
    apiEndpoint: '/api/boilers',
    addLabel: 'Котел утилизатор қўшиш',
  },
  {
    id: 'pressure-vessel-steam',
    key: 'pressureVesselSteam',
    title: 'Босим остида ишловчи идиш',
    apiEndpoint: '/api/pressure-vessels/steam',
    addLabel: 'Босим остида ишловчи идиш қўшиш',
  },
  {
    id: 'pressure-vessel-gas',
    key: 'pressureVesselGas',
    title: 'Босим остида ишловчи идиш (СУГ)',
    apiEndpoint: '/api/pressure-vessels/gas',
    addLabel: 'Босим остида ишловчи идиш (СУГ) қўшиш',
  },
  {
    id: 'gas-pipeline',
    key: 'gasPipeline',
    title: 'Йилига 100 минг ва ундан ортиқ м3 идиш',
    apiEndpoint: '/api/gas-pipelines',
    addLabel: 'Идиш қўшиш',
  },
]

export function getEquipmentById(id: string): EquipmentConfig | undefined {
  return EQUIPMENT_CONFIG.find((item) => item.id === id)
}

export function getEquipmentByKey(key: string): EquipmentConfig | undefined {
  return EQUIPMENT_CONFIG.find((item) => item.key === key)
}

export const DEFAULT_EQUIPMENT = EQUIPMENT_CONFIG[0]
