/** Where a registry record stands: in force, taken off the registry, or found invalid */
export type RegistryStatus = 'VALID' | 'INACTIVE' | 'INVALID'

/** RegistrationMode: filed through an appeal, or taken onto the registry as it was found */
export type RegistrationMode = 'OFFICIAL' | 'UNOFFICIAL'
