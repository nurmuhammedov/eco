// src/entities/create-application/types/dto.ts
import {
  AccreditationConclusionDtoSchema,
  AccreditationDtoSchema,
  AttestationAppealDtoSchema,
  AttractionPassportAppealDtoSchema,
  BoilerAppealDtoSchema,
  BoilerUtilizerAppealDtoSchema,
  CablewayAppealDtoSchema,
  CadastrePassportAppealDtoSchema,
  ChemicalContainerAppealDtoSchema,
  ContainerAppealDtoSchema,
  CraneAppealDtoSchema,
  DeclarationAppealDtoSchema,
  EscalatorAppealDtoSchema,
  ExpandAccreditationDtoSchema,
  HeatPipelineAppealDtoSchema,
  HFAppealDtoSchema,
  HoistAppealDtoSchema,
  IrsAppealDtoSchema,
  XrayAppealDtoSchema,
  LifAppealDtoSchema,
  LpgContainerAppealDtoSchema,
  LpgPoweredAppealDtoSchema,
  PipelineAppealDtoSchema,
  ReAccreditationDtoSchema,
  IllegalCraneAppealDtoSchema,
  ContainerIllegalAppealDtoSchema,
  AttractionIllegalAppealDtoSchema,
  EscalatorIllegalAppealDtoSchema,
  PipelineIllegalAppealDtoSchema,
  BoilerUtilizerIllegalAppealDtoSchema,
} from '@/entities/create-application/schemas';
import { z } from 'zod';
import { DeRegisterEquipment } from '@/entities/create-application/schemas/de-register-equipment';
import { ReRegisterEquipmentSchema } from '@/entities/create-application/schemas/re-register-equipment.schema';
import { RegisterIllegalHFSchema } from '@/entities/create-application/schemas/register-illegal-hf-shcema';
import { BoilerIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-boiler.schema.ts';
import { LiftIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-lift.schema';
import { ChemicalIllegalContainerAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-chemical-container.schema.ts';
import { HeatPipelineIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-heat-pipeline.schema.ts';
import {
  AttractionAppealDtoSchema,
  HoistIllegalAppealDtoSchema,
  LpgContainerIllegalAppealDtoSchema,
  LpgPoweredIllegalAppealDtoSchema,
} from '@/entities/create-application';
import { CablewayIllegalAppealDtoSchema } from '@/entities/create-application/schemas/register-illegal-cableway.schema.ts';
import { DeRegisterHFO } from '@/entities/create-application/schemas/de-register-hfo.ts';

export type CreateHPOApplicationDTO = z.infer<typeof HFAppealDtoSchema>;
export type CreateCraneApplicationDTO = z.infer<typeof CraneAppealDtoSchema>;
export type CreateLiftApplicationDTO = z.infer<typeof LifAppealDtoSchema>;
export type CreateContainerApplicationDTO = z.infer<typeof ContainerAppealDtoSchema>;
export type CreateBoilerApplicationDTO = z.infer<typeof BoilerAppealDtoSchema>;
export type CreateEscalatorApplicationDTO = z.infer<typeof EscalatorAppealDtoSchema>;
export type CreatePipelineApplicationDTO = z.infer<typeof PipelineAppealDtoSchema>;
export type CreateChemicalContainerApplicationDTO = z.infer<typeof ChemicalContainerAppealDtoSchema>;
export type CreateHeatPipelineApplicationDTO = z.infer<typeof HeatPipelineAppealDtoSchema>;
export type CreateBoilerUtilizerApplicationDTO = z.infer<typeof BoilerUtilizerAppealDtoSchema>;
export type CreateLpgContainerApplicationDTO = z.infer<typeof LpgContainerAppealDtoSchema>;
export type CreateLpgPoweredApplicationDTO = z.infer<typeof LpgPoweredAppealDtoSchema>;
export type CreateHoistApplicationDTO = z.infer<typeof HoistAppealDtoSchema>;
export type CreateCablewayApplicationDTO = z.infer<typeof CablewayAppealDtoSchema>;
export type CreateIrsApplicationDTO = z.infer<typeof IrsAppealDtoSchema>;
export type CreateXrayApplicationDTO = z.infer<typeof XrayAppealDtoSchema>;
export type CreateAttractionPassportApplicationDTO = z.infer<typeof AttractionPassportAppealDtoSchema>;
export type CreateAttractionApplicationDTO = z.infer<typeof AttractionAppealDtoSchema>;
export type CreateAccreditationDTO = z.infer<typeof AccreditationDtoSchema>;
export type ReAccreditationDTO = z.infer<typeof ReAccreditationDtoSchema>;
export type AccreditationConclusionDTO = z.infer<typeof AccreditationConclusionDtoSchema>;
export type ExpandAccreditationDTO = z.infer<typeof ExpandAccreditationDtoSchema>;
export type CreateAttestationDTO = z.infer<typeof AttestationAppealDtoSchema>;
export type CreateCadastrePassportApplicationDTO = z.infer<typeof CadastrePassportAppealDtoSchema>;
export type CreateDeclarationApplicationDTO = z.infer<typeof DeclarationAppealDtoSchema>;
export type DeRegisterEquipmentDTO = z.infer<typeof DeRegisterEquipment>;
export type ReRegisterEquipmentDTO = z.infer<typeof ReRegisterEquipmentSchema>;
export type RegisterIllegalHFSchemaDTO = z.infer<typeof RegisterIllegalHFSchema>;
export type RegisterIllegalCraneApplicationDTO = z.infer<typeof IllegalCraneAppealDtoSchema>;
export type RegisterIllegalContainerApplicationDTO = z.infer<typeof ContainerIllegalAppealDtoSchema>;
export type RegisterIllegalBoilerApplicationDTO = z.infer<typeof BoilerIllegalAppealDtoSchema>;
export type RegisterIllegalLiftApplicationDTO = z.infer<typeof LiftIllegalAppealDtoSchema>;
export type RegisterIllegalEscalatorApplicationDTO = z.infer<typeof EscalatorIllegalAppealDtoSchema>;
export type RegisterIllegalAttractionApplicationDTO = z.infer<typeof AttractionIllegalAppealDtoSchema>;
export type RegisterIllegalPipelineApplicationDTO = z.infer<typeof PipelineIllegalAppealDtoSchema>;
export type RegisterIllegalChemicalContainerApplicationDTO = z.infer<typeof ChemicalIllegalContainerAppealDtoSchema>;
export type RegisterIllegalHeatPipelineApplicationDTO = z.infer<typeof HeatPipelineIllegalAppealDtoSchema>;
export type RegisterIllegalBoilerUtilizerApplicationDTO = z.infer<typeof BoilerUtilizerIllegalAppealDtoSchema>;
export type RegisterIllegalLpgContainerApplicationDTO = z.infer<typeof LpgContainerIllegalAppealDtoSchema>;
export type RegisterIllegalLpgPoweredAppApplicationDTO = z.infer<typeof LpgPoweredIllegalAppealDtoSchema>;
export type RegisterIllegalHoistAppApplicationDTO = z.infer<typeof HoistIllegalAppealDtoSchema>;
export type RegisterIllegalCablewayAppApplicationDTO = z.infer<typeof CablewayIllegalAppealDtoSchema>;
export type DeRegisterHFOtDTO = z.infer<typeof DeRegisterHFO>;
