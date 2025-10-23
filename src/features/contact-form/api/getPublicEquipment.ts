// src/features/contact-form/api/getPublicEquipment.ts
import { publicApi } from '@/shared/api/public';

// Backenddan keladigan ma'lumot turini (tipini) import qiling yoki yarating
// Masalan: import { IEquipment } from '@/entities/equipment';
// Hozircha any deb turamiz.
type EquipmentData = any;

export const getPublicEquipmentById = async (id: string): Promise<EquipmentData> => {
  try {
    // Backendning ochiq endpoint manzilini to'g'ri yozing
    // Masalan: '/public/equipments/' yoki shunga o'xshash
    const response = await publicApi.get(`/api/v1/public/equipments/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Public equipment ma'lumotini olishda xatolik:", error);
    throw new Error("Ma'lumot topilmadi");
  }
};
