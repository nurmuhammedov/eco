import { z } from 'zod';
import { ApplicationBaseSchema, defaultRequiredMessage } from './application-base.schema.ts';

export const CreateRegisterBoiler = ApplicationBaseSchema.extend({
  hpo_id: z.string(defaultRequiredMessage),
  crane_type: z.string(defaultRequiredMessage),
  fileUrls: z.array(z.string().url()).min(1, 'Камида 1 та файл юкланиши керак').default([]),
  factoryNumber: z.string(defaultRequiredMessage).min(1, 'Завод рақами мажбурий').describe('Qurilmaning zavod raqami'),
  region: z.string(defaultRequiredMessage).min(1, 'Вилоят номи мажбурий').describe('Қурилма жойлашган вилоят'),
  district: z.string(defaultRequiredMessage).min(1, 'Туман номи мажбурий').describe('Қурилма жойлашган туман'),
  address: z.string(defaultRequiredMessage).min(1, 'Манзил мажбурий').describe('Қурилма жойлашган манзил'),
  geolocation: z.tuple([z.number(), z.number()], defaultRequiredMessage).describe('Геолокация'),
  model: z.string(defaultRequiredMessage).min(1, 'Модель номи ва маркаси мажбурий').describe('Қурилманинг модели'),
  manufacturer: z
    .string(defaultRequiredMessage)
    .min(1, 'Ишлаб чиқарувчи номи мажбурий')
    .describe('Ishlab chiqargan zavod nomi'),
  ownerName: z
    .string(defaultRequiredMessage)
    .min(1, 'Қурилма эгасининг номи мажбурий')
    .describe('Қурилма эгасининг номи'),
  productionDate: z.date(defaultRequiredMessage).describe('Қурилманинг ишлаб чиқарилган санаси'),
  boomLength: z
    .string(defaultRequiredMessage)
    .min(0, 'Стреланинг узунлиги мусбат сон бўлиши керак')
    .describe('Стреланинг узунлиги'),
  loadCapacity: z
    .string({ message: 'Юк кўтариш ҳажми мусбат сон бўлиши керак' })
    .min(1, 'Юк кўтариш ҳажми мусбат сон бўлиши керак')
    .describe('Қурилманинг юк кўтара олиш ҳажми'),
  cranePhoto: z
    .array(z.string(defaultRequiredMessage).url('Қурилманинг расми учун яроқли URL киритинг'))
    .min(1, 'Камида 1 та файл юкланиши керак')
    .describe('Краннинг биркаси билан сурати')
    .default([]),
  description: z.string(defaultRequiredMessage).describe('Ариза баёни'),
});
