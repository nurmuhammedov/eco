# Loader Component

`Loader` komponenti - to'liq ekranni qoplovchi yuklash indikatori. Asinxron operatsiyalar davomida foydalanuvchi interfeysi blokirovka qilish uchun mo'ljallangan.

## Foydalanish yo'riqnomasi

1. **Komponentni import qilish**:

   ```jsx
   import Loader from 'path/to/Loader';
   ```

2. **Asosiy foydalanish**:

   ```jsx
   // Komponentni chaqirish
   <Loader isVisible={true} />
   ```

3. **State bilan ishlatish**:

   ```jsx
   import { useState } from 'react';

   function MyComponent() {
     const [loading, setLoading] = useState(false);

     const handleFetch = async () => {
       setLoading(true);
       try {
         await fetchData();
       } finally {
         setLoading(false);
       }
     };

     return (
       <>
         <button onClick={handleFetch}>Ma'lumotlarni yuklash</button>
         <Loader isVisible={loading} message="loading.data" />
       </>
     );
   }
   ```

4. **Parametrlarni sozlash**:

   ```jsx
   // Kattaroq loader va to'qroq fon bilan
   <Loader isVisible={loading} message="loading.please_wait" size={50} bgOpacity={80} />
   ```

5. **Tarjima fayllari bilan ishlash**:
   ```json
   {
     "loading": {
       "data": "Ma'lumotlar yuklanmoqda...",
       "please_wait": "Iltimos kuting..."
     }
   }
   ```

## Xususiyatlar

- To'liq ekranni qoplovchi overlay
- Aylanuvchi yuklash animatsiyasi (Loader2 ikonkasi)
- Sozlanadigan fon shaffofligi
- Ixtiyoriy xabar ko'rsatish imkoniyati
- Scroll bloklash
- Tarjima qo'llab-quvvatlash
- Accessibility talablariga javob berish

## Props

| Prop        | Turi      | Default | Tavsif                                                  |
| ----------- | --------- | ------- | ------------------------------------------------------- |
| `isVisible` | `boolean` | `false` | Loaderni ko'rsatish yoki yashirish                      |
| `message`   | `string`  | -       | Ko'rsatiladigan xabar (i18n kalit sifatida ishlatiladi) |
| `size`      | `number`  | `40`    | Loader ikonkasi o'lchami pikselda                       |
| `bgOpacity` | `number`  | `50`    | Fon qoraligining shaffofligi (0-100)                    |

## Ishlash mexanizmi

1. **Render boshqaruvi**:

   - `isVisible={false}` holatida komponent `null` qaytaradi (hech narsa ko'rsatilmaydi)
   - `isVisible={true}` holatida to'liq ekran overlay ko'rsatiladi
   - `memo` orqali keraksiz qayta renderlar optimallashtiririladi

2. **Scroll bloklash**:

   - `useEffect` hook orqali ishlaydi
   - Loader faollashganda:
     - Dastlabki overflow va padding qiymatlari saqlanadi
     - Scrollbar kengligi hisoblanadi (`innerWidth - clientWidth`)
     - `document.body.style.overflow = 'hidden'` orqali scroll bloklanadi
     - Layout shift oldini olish uchun scrollbar o'rniga padding qo'shiladi
   - Loader o'chirilganda:
     - 100ms kechikish bilan dastlabki body uslublari tiklanadi

3. **Vizual qatlam**:

   - `fixed inset-0 z-50` orqali to'liq ekranni qoplash
   - `bg-black/${bgOpacity}` orqali fon shaffofligi dinamik o'zgartiriladi
   - `backdrop-blur-sm` orqali orqa fon xiralashtiriladi
   - `flex items-center justify-center` orqali content markazlashtiriladi

4. **Animatsiya va kontekst**:

   - `Loader2` ikonkasi `animate-spin` orqali aylantiriladi
   - `message` mavjud bo'lganda `useTranslation` orqali tarjima qilinadi

5. **Accessibility**:
   - `role="dialog"` va `aria-modal="true"` atributlari modal sifatida belgilaydi
   - `aria-labelledby` xabar bilan bog'laydi
   - Ikonka `aria-hidden="true"` orqali screen reader'lardan yashiriladi

## Texnik tafsilotlar

- `Loader2` ikonkasi lucide-react kutubxonasidan olinadi
- Component `FC<StandaloneLoaderProps>` tipida definitsiya qilingan
- Server-side rendering bilan mos keladi
- Scroll bloklash uchun `useRef` va `useEffect` ishlatilgan
