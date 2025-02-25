import { z } from 'zod';
import {
  ApplicationBaseSchema,
  defaultRequiredMessage,
} from './application-base.schema';

export const CreateRegisterCrane = ApplicationBaseSchema.extend({
  hpo_id: z.string(defaultRequiredMessage),
  crane_type: z.string(defaultRequiredMessage),
  registrationNumber: z
    .string()
    .min(1, 'Рўйхатга олиш рақами мажбурий')
    .describe('Қурилманинг рўйхатга олиш рақами'),
  factoryNumber: z
    .string()
    .min(1, 'Завод рақами мажбурий')
    .describe('Қурилманинг завод рақами'),
  region: z
    .string()
    .min(1, 'Вилоят номи мажбурий')
    .describe('Қурилма жойлашган вилоят'),
  district: z
    .string()
    .min(1, 'Туман номи мажбурий')
    .describe('Қурилма жойлашган туман'),
  address: z
    .string()
    .min(1, 'Манзил мажбурий')
    .describe('Қурилма жойлашган манзил'),
  geolocation: z.tuple([z.number(), z.number()]).describe('Геолокация'),
  model: z
    .string()
    .min(1, 'Модель номи ва маркаси мажбурий')
    .describe('Қурилманинг модели'),
  manufacturer: z
    .string()
    .min(1, 'Ишлаб чиқарувчи номи мажбурий')
    .describe('Ишлаб чиқарган завод номи'),
  ownerName: z
    .string()
    .min(1, 'Қурилма эгасининг номи мажбурий')
    .describe('Қурилма эгасининг номи'),
  nextInspectionDate: z.date().describe('Кейинги текшириш санаси'),
  productionDate: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      'Ишлаб чиқарилган сана яроқли сана бўлиши керак',
    )
    .describe('Қурилманинг ишлаб чиқарилган санаси'),
  boomLength: z
    .number()
    .min(0, 'Стреланинг узунлиги мусбат сон бўлиши керак')
    .describe('Стреланинг узунлиги'),
  loadCapacity: z
    .number()
    .min(0, 'Юк кўтариш ҳажми мусбат сон бўлиши керак')
    .describe('Қурилманинг юк кўтара олиш ҳажми'),
  cranePhoto: z
    .string()
    .url('Қурилманинг расми учун яроқли URL киритинг')
    .describe('Краннинг биркаси билан сурати'),
});
