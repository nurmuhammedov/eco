import { ApplicationType } from './application.types';
import { CreateRegisterHPOSchema } from './application-hpo.schema';
import { CreateRegisterCrane } from '@/entities/user/applications/model/application-crane.schema';
import { ApplicationBaseSchema } from './application-base.schema';
import { CreateRegisterPressureVesselChemicalSchema } from '@/entities/user/applications/model/application-pressure-vessel-chemical.schema.ts';

export const ApplicationSchema = {
  [ApplicationType.RegisterHPO]: CreateRegisterHPOSchema,
  [ApplicationType.DeregisterHPO]: CreateRegisterHPOSchema,
  [ApplicationType.RegisterCrane]: CreateRegisterCrane,
  [ApplicationType.ObtainLicense]: ApplicationBaseSchema,
  [ApplicationType.ObtainPermit]: ApplicationBaseSchema,
  [ApplicationType.ObtainINM]: ApplicationBaseSchema,
  [ApplicationType.DeregisterHPOCadastrePassport]: ApplicationBaseSchema,
  [ApplicationType.ObtainConclusion]: ApplicationBaseSchema,
  [ApplicationType.DeregisterSafetyExpertConclusion]: ApplicationBaseSchema,
  [ApplicationType.RegisterSafetyExpertConclusion]: ApplicationBaseSchema,
  [ApplicationType.RegisterPressureVesselLPG]: ApplicationBaseSchema,
  [ApplicationType.RegisterHighGasUsageEquipment]: ApplicationBaseSchema,
  [ApplicationType.RegisterVessel]: ApplicationBaseSchema,
  [ApplicationType.RegisterBoiler]: ApplicationBaseSchema,
  [ApplicationType.RegisterLift]: ApplicationBaseSchema,
  [ApplicationType.RegisterAttraction]: ApplicationBaseSchema,
  [ApplicationType.DeregisterAttractionPassport]: ApplicationBaseSchema,
  [ApplicationType.DeregisterAttraction]: ApplicationBaseSchema,
  [ApplicationType.RegisterHPOCadastrePassport]: ApplicationBaseSchema,
  [ApplicationType.RegisterBoilerUtilizer]: ApplicationBaseSchema,
  [ApplicationType.RegisterSteamAndHotWaterPipeline]: ApplicationBaseSchema,
  [ApplicationType.RegisterPressureVesselChemical]:
    CreateRegisterPressureVesselChemicalSchema,
  [ApplicationType.RegisterEscalator]: ApplicationBaseSchema,
  [ApplicationType.RegisterBridgeOrRoad]: ApplicationBaseSchema,
  [ApplicationType.RegisterElevator]: ApplicationBaseSchema,
  [ApplicationType.RegisterPipeline]: ApplicationBaseSchema,
  [ApplicationType.DeregisterCrane]: ApplicationBaseSchema,
  [ApplicationType.DeregisterVessel]: ApplicationBaseSchema,
  [ApplicationType.DeregisterBoiler]: ApplicationBaseSchema,
  [ApplicationType.DeregisterLift]: ApplicationBaseSchema,
  [ApplicationType.DeregisterEscalator]: ApplicationBaseSchema,
  [ApplicationType.DeregisterBridgeOrRoad]: ApplicationBaseSchema,
  [ApplicationType.DeregisterElevator]: ApplicationBaseSchema,
  [ApplicationType.DeregisterPipeline]: ApplicationBaseSchema,
  [ApplicationType.CertifyHPOEmployee]: ApplicationBaseSchema,
  [ApplicationType.ReaccreditExpertOrganization]: ApplicationBaseSchema,
  [ApplicationType.ExpandAccreditationScope]: ApplicationBaseSchema,
  [ApplicationType.AccreditExpertOrganization]: ApplicationBaseSchema,
  [ApplicationType.RegisterSafetyDeclaration]: ApplicationBaseSchema,
  [ApplicationType.DeregisterSafetyDeclaration]: ApplicationBaseSchema,
  [ApplicationType.IssueINM]: ApplicationBaseSchema,
  [ApplicationType.RegisterINM]: ApplicationBaseSchema,
  [ApplicationType.DeregisterINM]: ApplicationBaseSchema,
  [ApplicationType.RegisterAttractionPassport]: ApplicationBaseSchema,
  [ApplicationType.Other]: ApplicationBaseSchema,
};

export const defaultApplicationValues: Record<string, any> = {
  [ApplicationType.RegisterHPO]: {
    application_type: ApplicationType.RegisterHPO,
  },
  [ApplicationType.DeregisterHPO]: {
    application_type: ApplicationType.DeregisterHPO,
  },
  [ApplicationType.RegisterCrane]: {
    application_type: ApplicationType.RegisterCrane,
  },
  [ApplicationType.RegisterPressureVesselChemical]: {
    application_type: ApplicationType.RegisterPressureVesselChemical,
  },
};
