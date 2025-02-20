import { z } from 'zod';
import { ApplicationType } from './application.types';

const emailMessage = 'Яроқсиз почта манзили';
const defaultRequiredMessage = { message: 'Мажбурий майдон' };

export const ApplicationBaseSchema = z.object({
  phone: z
    .string(defaultRequiredMessage)
    .trim()
    .refine((value) => /^(\+998\d{9})$/.test(value), {
      message: 'Телефон рақами нотўғри',
    }),
  email: z.string(defaultRequiredMessage).email(emailMessage),
  application_type: z.string(),
});

export const CreateRegisterHPOSchema = ApplicationBaseSchema.extend({
  account_number: z.string(defaultRequiredMessage),
  parent_name: z.string(defaultRequiredMessage),
  organization_name: z.string(defaultRequiredMessage),
  organization_email: z.string(defaultRequiredMessage).email(emailMessage),
  tin: z
    .string(defaultRequiredMessage)
    .length(9, 'СТИР 9 хоналик сондан иборат'),
  hpo_name: z.string(defaultRequiredMessage),
  hpo_type: z.string(defaultRequiredMessage),
  hpo_objects_name: z.string(defaultRequiredMessage),
  hazardous_name: z.string(defaultRequiredMessage),
  reason: z.string(defaultRequiredMessage),
  networks: z.string(defaultRequiredMessage),
  region: z.string(defaultRequiredMessage),
  district: z.string(defaultRequiredMessage),
  address: z.string(defaultRequiredMessage),
  description: z.string(defaultRequiredMessage),
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
