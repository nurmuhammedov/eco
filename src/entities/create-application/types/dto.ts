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
  LifAppealDtoSchema,
  LpgContainerAppealDtoSchema,
  LpgPoweredAppealDtoSchema,
  PipelineAppealDtoSchema,
  ReAccreditationDtoSchema,
} from '@/entities/create-application/schemas';
import { z } from 'zod';
import { DeRegisterEquipment } from '@/entities/create-application/schemas/de-register-equipment';
import { ReRegisterEquipmentSchema } from '@/entities/create-application/schemas/re-register-equipment.schema';

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
export type CreateAttractionPassportApplicationDTO = z.infer<typeof AttractionPassportAppealDtoSchema>;
export type CreateAccreditationDTO = z.infer<typeof AccreditationDtoSchema>;
export type ReAccreditationDTO = z.infer<typeof ReAccreditationDtoSchema>;
export type AccreditationConclusionDTO = z.infer<typeof AccreditationConclusionDtoSchema>;
export type ExpandAccreditationDTO = z.infer<typeof ExpandAccreditationDtoSchema>;
export type CreateAttestationDTO = z.infer<typeof AttestationAppealDtoSchema>;
export type CreateCadastrePassportApplicationDTO = z.infer<typeof CadastrePassportAppealDtoSchema>;
export type CreateDeclarationApplicationDTO = z.infer<typeof DeclarationAppealDtoSchema>;
export type DeRegisterEquipmentDTO = z.infer<typeof DeRegisterEquipment>;
export type ReRegisterEquipmentDTO = z.infer<typeof ReRegisterEquipmentSchema>;
