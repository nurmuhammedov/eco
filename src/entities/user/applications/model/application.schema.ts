import { z } from 'zod';
import { ApplicationType } from './application.types';

const defaultRequiredMessage = { message: 'Majburiy maydon' };

export const ApplicationBaseSchema = z.object({
  phone: z
    .string(defaultRequiredMessage)
    .trim()
    .refine((value) => /^(\+998\d{9})$/.test(value), {
      message: "Telefon raqami noto'g'ri!",
    }),
  email: z.string(defaultRequiredMessage).email('Noto‘g‘ri email'),
});

export const CreateRegisterHPOSchema = ApplicationBaseSchema.extend({
  name: z.string().optional(),
  description: z.string().optional(),
  hpoId: z.string().optional(),
});

export const ApplicationSchema = {
  [ApplicationType.RegisterHPO]: CreateRegisterHPOSchema,
  [ApplicationType.DeregisterHPO]: CreateRegisterHPOSchema,
  [ApplicationType.ObtainLicense]: ApplicationBaseSchema,
  [ApplicationType.ObtainPermit]: ApplicationBaseSchema,
  [ApplicationType.ObtainINM]: ApplicationBaseSchema,
  [ApplicationType.DeregisterHPOCadastrePassport]: ApplicationBaseSchema,
  [ApplicationType.ObtainConclusion]: ApplicationBaseSchema,
  [ApplicationType.RegisterCrane]: ApplicationBaseSchema,
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
  [ApplicationType.RegisterPressureVesselChemical]: ApplicationBaseSchema,
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
  [ApplicationType.AccreditExpertOrganization]: ApplicationBaseSchema,
  [ApplicationType.RegisterSafetyDeclaration]: ApplicationBaseSchema,
  [ApplicationType.DeregisterSafetyDeclaration]: ApplicationBaseSchema,
  [ApplicationType.IssueINM]: ApplicationBaseSchema,
  [ApplicationType.RegisterINM]: ApplicationBaseSchema,
  [ApplicationType.DeregisterINM]: ApplicationBaseSchema,
  [ApplicationType.RegisterAttractionPassport]: ApplicationBaseSchema,
  [ApplicationType.Other]: ApplicationBaseSchema,
};
