// src/entities/create-application/types/dto.ts
import {
  AttestationAppealDtoSchema,
  AttractionIllegalAppealDtoSchema,
  BoilerAppealDtoSchema,
  BoilerUtilizerAppealDtoSchema,
  BoilerUtilizerIllegalAppealDtoSchema,
  CablewayAppealDtoSchema,
  ChemicalContainerAppealDtoSchema,
  ContainerAppealDtoSchema,
  ContainerIllegalAppealDtoSchema,
  CraneAppealDtoSchema,
  EscalatorAppealDtoSchema,
  EscalatorIllegalAppealDtoSchema,
  HeatPipelineAppealDtoSchema,
  HFAppealDtoSchema,
  HoistAppealDtoSchema,
  IllegalCraneAppealDtoSchema,
  IrsAppealDtoSchema,
  LifAppealDtoSchema,
  LpgContainerAppealDtoSchema,
  LpgPoweredAppealDtoSchema,
  PipelineAppealDtoSchema,
  PipelineIllegalAppealDtoSchema,
  XrayAppealDtoSchema,
  XrayIllegalAppealDtoSchema,
} from '@/entities/create-application/schemas'
import { z } from 'zod'
import { DeRegisterEquipmentSchema } from '@/entities/create-application/schemas/de-register-equipment'
import { ReRegisterEquipmentSchema } from '@/entities/create-application/schemas/re-register-equipment.schema'
import { RegisterIllegalHFSchema } from '@/entities/create-application/schemas/register-illegal-hf-shcema'
import { BoilerIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-boiler.schema.ts'
import { LiftIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-lift.schema'
import { ChemicalIllegalContainerAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-chemical-container.schema.ts'
import { HeatPipelineIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-heat-pipeline.schema.ts'
import {
  AttractionAppealDtoSchema,
  HoistIllegalAppealDtoSchema,
  LpgContainerIllegalAppealDtoSchema,
  LpgPoweredIllegalAppealDtoSchema,
} from '@/entities/create-application'
import { CablewayIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-cableway.schema.ts'
import { DeRegisterHFSchema } from '@/entities/create-application/schemas/de-register-hf.schema.ts'
import { ReRegisterHFSchema } from '@/entities/create-application/schemas/re-register-hf.schema'
import { ReRegisterIllegalHFSchema } from '@/entities/create-application/schemas/re-register-illegal-hf.schema'

export type CreateHFApplicationDTO = z.infer<typeof HFAppealDtoSchema>
export type ReRegisterHFApplicationDTO = z.infer<typeof ReRegisterHFSchema>
export type ReRegisterIllegalHFApplicationDTO = z.infer<typeof ReRegisterIllegalHFSchema>
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
export type CreateIllegalXrayApplicationDTO = z.infer<typeof XrayIllegalAppealDtoSchema>
export type CreateAttractionApplicationDTO = z.infer<typeof AttractionAppealDtoSchema>
export type CreateAttestationDTO = z.infer<typeof AttestationAppealDtoSchema>
export type DeRegisterEquipmentDTO = z.infer<typeof DeRegisterEquipmentSchema>
export type ReRegisterEquipmentDTO = z.infer<typeof ReRegisterEquipmentSchema>
export type RegisterIllegalHFSchemaDTO = z.infer<typeof RegisterIllegalHFSchema>
export type RegisterIllegalCraneApplicationDTO = z.infer<typeof IllegalCraneAppealDtoSchema>
export type RegisterIllegalContainerApplicationDTO = z.infer<typeof ContainerIllegalAppealDtoSchema>
export type RegisterIllegalBoilerApplicationDTO = z.infer<typeof BoilerIllegalAppealDtoSchema>
export type RegisterIllegalLiftApplicationDTO = z.infer<typeof LiftIllegalAppealDtoSchema>
export type RegisterIllegalEscalatorApplicationDTO = z.infer<typeof EscalatorIllegalAppealDtoSchema>
export type RegisterIllegalAttractionApplicationDTO = z.infer<typeof AttractionIllegalAppealDtoSchema>
export type RegisterIllegalPipelineApplicationDTO = z.infer<typeof PipelineIllegalAppealDtoSchema>
export type RegisterIllegalChemicalContainerApplicationDTO = z.infer<typeof ChemicalIllegalContainerAppealDtoSchema>
export type RegisterIllegalHeatPipelineApplicationDTO = z.infer<typeof HeatPipelineIllegalAppealDtoSchema>
export type RegisterIllegalBoilerUtilizerApplicationDTO = z.infer<typeof BoilerUtilizerIllegalAppealDtoSchema>
export type RegisterIllegalLpgContainerApplicationDTO = z.infer<typeof LpgContainerIllegalAppealDtoSchema>
export type RegisterIllegalLpgPoweredAppApplicationDTO = z.infer<typeof LpgPoweredIllegalAppealDtoSchema>
export type RegisterIllegalHoistAppApplicationDTO = z.infer<typeof HoistIllegalAppealDtoSchema>
export type RegisterIllegalCablewayAppApplicationDTO = z.infer<typeof CablewayIllegalAppealDtoSchema>
export type DeRegisterHFDTO = z.infer<typeof DeRegisterHFSchema>
