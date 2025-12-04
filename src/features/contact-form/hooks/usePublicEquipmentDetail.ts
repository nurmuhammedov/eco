import { useQuery } from '@tanstack/react-query' // Loyihangizda react-query o'rniga boshqa narsa bo'lsa, shuni yozing
import { getPublicEquipmentById } from '../api/getPublicEquipment'

export const usePublicEquipmentDetail = (id?: string) => {
  return useQuery({
    // Ushbu so'rov uchun unikal kalit.
    // React Query shu kalit orqali ma'lumotni keshlaydi.
    queryKey: ['publicEquipment', id],

    // Ma'lumotni olib keladigan funksiya.
    // `id` mavjud bo'lsa, `getPublicEquipmentById(id)` chaqiriladi.
    queryFn: () => getPublicEquipmentById(id!),

    // `enabled: !!id` - bu juda muhim shart.
    // Bu "Faqat `id` mavjud bo'lgandagina (null yoki undefined bo'lmaganda) bu so'rovni yubor" degani.
    enabled: !!id,

    // Agar xatolik yuz bersa, qayta urinishlar soni (ixtiyoriy)
    retry: 1,
  })
}
