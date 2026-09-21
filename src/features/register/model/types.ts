/**
 * What a row of the registry carries. Every section shows the owning
 * organisation and its registry entry the same way; the fields below that are
 * optional belong to one section or another, which is why the lists share a
 * single shape instead of five nearly identical ones.
 */
export interface RegistryRow {
  id: string
  registryNumber?: string
  registrationDate?: string

  legalName?: string
  legalTin?: string | number
  legalAddress?: string
  directorName?: string
  ownerName?: string
  ownerIdentity?: string | number
  tin?: string | number
  pin?: string | number

  name?: string
  address?: string
  regionId?: string | number

  /** Set only on the "change requests" tab, where the row is a pending request. */
  changeBelongType?: string
}

/** A hazardous facility as the register lists it. */
export interface HazardousFacilityRow extends RegistryRow {
  typeName?: string
}

/** An X-ray unit; its licence is registered apart from the unit itself. */
export interface XrayRow extends RegistryRow {
  licenseRegistryNumber?: string
  licenseExpiryDate?: string
}

/** A radiation source. */
export interface IrsRow extends RegistryRow {
  category?: string
  symbol?: string
  factoryNumber?: string
  activity?: string | number
  usageType?: string
}

/** A piece of equipment, which the register keeps far more detail about. */
export interface EquipmentRow extends RegistryRow {
  registerNumber?: string
  factoryNumber?: string
  model?: string
  type?: string
  childEquipment?: string
  activityType?: string
  activityTypeName?: string
  numberPlate?: string
  expiryDate?: string
  validUntil?: string
  nextPartialCheckDate?: string
  nextFullCheckDate?: string
  expertiseExpiryDate?: string
}
