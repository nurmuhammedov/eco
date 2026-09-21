/**
 * The enum is a runtime value the schema validates against, so it cannot live
 * beside the types the schema itself produces - that made the two files depend
 * on each other.
 */
export enum EquipmentTypeEnum {
  CRANE = 'CRANE',
  CONTAINER = 'CONTAINER',
  BOILER = 'BOILER',
  ELEVATOR = 'ELEVATOR',
  ESCALATOR = 'ESCALATOR',
  CABLEWAY = 'CABLEWAY',
  HOIST = 'HOIST',
  ATTRACTION = 'ATTRACTION',
  PIPELINE = 'PIPELINE',
  CHEMICAL_CONTAINER = 'CHEMICAL_CONTAINER',
  HEAT_PIPELINE = 'HEAT_PIPELINE',
  BOILER_UTILIZER = 'BOILER_UTILIZER',
  LPG_CONTAINER = 'LPG_CONTAINER',
  LPG_POWERED = 'LPG_POWERED',
}
