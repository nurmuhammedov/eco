import { ApplicationTypeEnum } from './application.types.ts';
import { CreateRegisterCrane } from './application-crane.schema.ts';
import { ApplicationBaseSchema } from './application-base.schema.ts';
import { CreateRegisterHPOSchema } from './application-hpo.schema.ts';
import { CreateRegisterBoiler } from './application-boiler.schema.ts';
import { CreateRegisterPressureVesselChemicalSchema } from './application-pressure-vessel-chemical.schema.ts';

export const ApplicationSchema = {
  [ApplicationTypeEnum.RegisterHPO]: CreateRegisterHPOSchema,
  [ApplicationTypeEnum.DeregisterHPO]: CreateRegisterHPOSchema,
  [ApplicationTypeEnum.RegisterCrane]: CreateRegisterCrane,
  [ApplicationTypeEnum.ObtainLicense]: ApplicationBaseSchema,
  [ApplicationTypeEnum.ObtainPermit]: ApplicationBaseSchema,
  [ApplicationTypeEnum.ObtainINM]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterHPOCadastrePassport]: ApplicationBaseSchema,
  [ApplicationTypeEnum.ObtainConclusion]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterSafetyExpertConclusion]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterSafetyExpertConclusion]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterPressureVesselLPG]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterHighGasUsageEquipment]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterVessel]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterBoiler]: CreateRegisterBoiler,
  [ApplicationTypeEnum.RegisterLift]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterAttraction]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterAttractionPassport]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterAttraction]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterHPOCadastrePassport]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterBoilerUtilizer]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterSteamAndHotWaterPipeline]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterPressureVesselChemical]:
    CreateRegisterPressureVesselChemicalSchema,
  [ApplicationTypeEnum.RegisterEscalator]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterBridgeOrRoad]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterElevator]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterPipeline]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterCrane]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterVessel]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterBoiler]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterLift]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterEscalator]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterBridgeOrRoad]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterElevator]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterPipeline]: ApplicationBaseSchema,
  [ApplicationTypeEnum.CertifyHPOEmployee]: ApplicationBaseSchema,
  [ApplicationTypeEnum.ReaccreditExpertOrganization]: ApplicationBaseSchema,
  [ApplicationTypeEnum.ExpandAccreditationScope]: ApplicationBaseSchema,
  [ApplicationTypeEnum.AccreditExpertOrganization]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterSafetyDeclaration]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterSafetyDeclaration]: ApplicationBaseSchema,
  [ApplicationTypeEnum.IssueINM]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterINM]: ApplicationBaseSchema,
  [ApplicationTypeEnum.DeregisterINM]: ApplicationBaseSchema,
  [ApplicationTypeEnum.RegisterAttractionPassport]: ApplicationBaseSchema,
  [ApplicationTypeEnum.Other]: ApplicationBaseSchema,
};

export const defaultApplicationValues: Record<string, any> = {
  [ApplicationTypeEnum.RegisterHPO]: {
    application_type: ApplicationTypeEnum.RegisterHPO,
  },
  [ApplicationTypeEnum.DeregisterHPO]: {
    application_type: ApplicationTypeEnum.DeregisterHPO,
  },
  [ApplicationTypeEnum.RegisterCrane]: {
    application_type: ApplicationTypeEnum.RegisterCrane,
  },
  [ApplicationTypeEnum.RegisterPressureVesselChemical]: {
    application_type: ApplicationTypeEnum.RegisterPressureVesselChemical,
  },
  [ApplicationTypeEnum.RegisterBoiler]: {
    application_type: ApplicationTypeEnum.RegisterBoiler,
  },
};
