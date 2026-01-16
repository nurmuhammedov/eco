// src/entities/create-application/types/dto.ts
import {
  BoilerAppealDtoSchema,
  BoilerUtilizerAppealDtoSchema,
  CablewayAppealDtoSchema,
  ChemicalContainerAppealDtoSchema,
  ContainerAppealDtoSchema,
  CraneAppealDtoSchema,
  EscalatorAppealDtoSchema,
  HeatPipelineAppealDtoSchema,
  HFAppealDtoSchema,
  HoistAppealDtoSchema,
  IrsAppealDtoSchema,
  LifAppealDtoSchema,
  LpgContainerAppealDtoSchema,
  LpgPoweredAppealDtoSchema,
  PipelineAppealDtoSchema,
  XrayAppealDtoSchema,
} from '@/entities/create-application/schemas'
import { z } from 'zod'
import { DeRegisterEquipmentSchema } from '@/entities/create-application/schemas/de-register-equipment'
import { ReRegisterEquipmentSchema } from '@/entities/create-application/schemas/re-register-equipment.schema'
import { AttractionAppealDtoSchema } from '@/entities/create-application'
import { DeRegisterHFSchema } from '@/entities/create-application/schemas/de-register-hf.schema.ts'
import { ReRegisterHFSchema } from '@/entities/create-application/schemas/re-register-hf.schema'
import { ReRegisterIllegalHFSchema } from '@/entities/create-application/schemas/re-register-illegal-hf.schema'
import { OilContainerAppealDtoSchema } from '@/entities/create-application/schemas/oil-container.schema'
import { IllegalOilContainerAppealDtoSchema } from '@/entities/create-application/schemas/illegal-oil-container.schema'

export type CreateHFApplicationDTO = z.infer<typeof HFAppealDtoSchema>
export type ReRegisterHFApplicationDTO = z.infer<typeof ReRegisterHFSchema>
export type ReRegisterIllegalHFApplicationDTO = z.infer<typeof ReRegisterIllegalHFSchema>
export type CreateOilContainerApplicationDTO = z.infer<typeof OilContainerAppealDtoSchema>
export type CreateIllegalOilContainerApplicationDTO = z.infer<typeof IllegalOilContainerAppealDtoSchema>
export type CreateCraneApplicationDTO = z.infer<typeof CraneAppealDtoSchema>
export type CreateLiftApplicationDTO = z.infer<typeof LifAppealDtoSchema>
export type CreateContainerApplicationDTO = z.infer<typeof ContainerAppealDtoSchema>
export type CreateBoilerApplicationDTO = z.infer<typeof BoilerAppealDtoSchema>
export type CreateEscalatorApplicationDTO = z.infer<typeof EscalatorAppealDtoSchema>
export type CreatePipelineApplicationDTO = z.infer<typeof PipelineAppealDtoSchema>
export type CreateChemicalContainerApplicationDTO = z.infer<typeof ChemicalContainerAppealDtoSchema>
export type CreateHeatPipelineApplicationDTO = z.infer<typeof HeatPipelineAppealDtoSchema>
export type CreateBoilerUtilizerApplicationDTO = z.infer<typeof BoilerUtilizerAppealDtoSchema>
export type CreateLpgContainerApplicationDTO = z.infer<typeof LpgContainerAppealDtoSchema>
export type CreateLpgPoweredApplicationDTO = z.infer<typeof LpgPoweredAppealDtoSchema>
export type CreateHoistApplicationDTO = z.infer<typeof HoistAppealDtoSchema>
export type CreateCablewayApplicationDTO = z.infer<typeof CablewayAppealDtoSchema>
export type CreateIrsApplicationDTO = z.infer<typeof IrsAppealDtoSchema>
export type CreateXrayApplicationDTO = z.infer<typeof XrayAppealDtoSchema>
export type CreateAttractionApplicationDTO = z.infer<typeof AttractionAppealDtoSchema>
export type DeRegisterEquipmentDTO = z.infer<typeof DeRegisterEquipmentSchema>
export type ReRegisterEquipmentDTO = z.infer<typeof ReRegisterEquipmentSchema>
export type DeRegisterHFDTO = z.infer<typeof DeRegisterHFSchema>
