import { z } from 'zod'

export const IllegalOilContainerAppealDtoSchema = z.object({
  phoneNumber: z.string().min(1, { message: 'Majburiy maydon' }),
  hazardousFacilityId: z.string().min(1, { message: 'Majburiy maydon' }),
  childEquipmentId: z.number().optional(),
  regionId: z.string().min(1, { message: 'Majburiy maydon' }),
  districtId: z.string().min(1, { message: 'Majburiy maydon' }),
  address: z.string().min(1, { message: 'Majburiy maydon' }),
  location: z.string().min(1, { message: 'Majburiy maydon' }),
  capacity: z.string().min(1, { message: 'Majburiy maydon' }),
  nonDestructiveCheckDate: z.string().min(1, { message: 'Majburiy maydon' }),

  labelPath: z.string().min(1, { message: 'Majburiy maydon' }),
  saleContractPath: z.string().min(1, { message: 'Majburiy maydon' }),
  equipmentCertPath: z.string().min(1, { message: 'Majburiy maydon' }),
  assignmentDecreePath: z.string().min(1, { message: 'Majburiy maydon' }),
  expertisePath: z.string().min(1, { message: 'Majburiy maydon' }),
  expertiseExpiryDate: z.string().min(1, { message: 'Majburiy maydon' }),
  installationCertPath: z.string().min(1, { message: 'Majburiy maydon' }),
  passportPath: z.string().min(1, { message: 'Majburiy maydon' }),
})
