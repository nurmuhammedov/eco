# TXYZ kadastr pasporti — ish holati

> Oxirgi yangilanish: 2026-09-14. Uydagi kompyuterda qilingan ish, ishxonada davom ettirish uchun.
> Backend qo'llanmasi: [cadastre-passport-frontend-migration-guide.md](./cadastre-passport-frontend-migration-guide.md)

## Qisqacha

Backend kadastr pasportini **tashkilotlarning pog'onali xodimlar jarayoniga** o'tkazdi: SES va FVV endi bitta LEGAL akkaunt emas, ichida ijrochi → (o'rinbosar) → rahbar bosqichlari bor. Pog'onalarni admin sozlaydi, frontga `workflows[].allowedActions` orqali keladi.

Frontend backendga to'liq moslashtirildi va GitHub'ga qo'yildi. **Test bazada jarayon sozlanishi hali yakunlanmagan** — ertangi ish shundan boshlanadi.

## Qilingan ishlar

### 1. Mavjud oqim tuzatildi (`src/features/cadastre-passport`)

- **Yaratish:** 24 ta maydon endi `preparerData` ichida yuboriladi.
- **Batafsil sahifa** yangi javobga ulandi: `cadastreData.{preparerData, fvvData, sesData}`, `reviews[].party`, `workflows[]`.
- **Ruxsatlar:**
  - tahrirlash/o'chirish — faqat `NEW` va tayyorlovchi;
  - buyurtmachi imzosi — `NEW`, rad etishda sabab majburiy;
  - qo'mita — `MANAGER` + `CADASTRE_PASSPORT`.
- **Qayta yuborish:** `REJECTED` + tayyorlovchi → qo'shish sahifasi buyurtmachi va eski ariza raqami bilan ochiladi. Yangi pasportda "Oldin yuborilgan pasport" havolasi bor.
- **Olib tashlandi:** `fvv-sign` / `ses-sign`, qattiq yozilgan FVV/SES TIN va rahbar ismlari (`model/organizations.ts`), backend e'tiborsiz qoldiradigan `preparerName` / `customerName` filtrlari.

### 2. SES/FVV xodimlari jarayoni (yangi)

- Xodim `GET /org-employees/me` bilan aniqlanadi (`src/entities/org-membership`).
- Menyuda "TXYZ Kadastr" → "Mening ishlarim" (`/workflow-instances/my-tasks`) va "Barcha pasportlar" tablari.
- Detal sahifada har bir tashkilot kartasi: progress, hozir kimda, holati, harakatlar tarixi (`/workflow-instances/{id}/history`).
- Tugmalar faqat `allowedActions` dan: `FILL_DATA` forma, `SUBMIT`, `ENDORSE`, `RETURN`, `REJECT`, `SIGN` (e-imzo, oldin ijrochi xulosasi ko'rsatiladi).

### 3. Admin panel: `/org-workflow` (menyu: "TXYZ jarayoni")

Bitta sahifada, tablar sozlash tartibida: Tashkilotlar → Lavozimlar → Xodimlar → Pog'onalar → Ishtirokchilar. Tablar, filtrlar va qo'shish tugmasi bitta qatorda. "Yangi versiya" formasi faol pog'onalar bilan to'ldirilib ochiladi.

## Backend'dan aniqlangan muhim narsalar

Hammasi test serverdagi jar va test bazadan tekshirilgan, taxmin emas.

- **`/users/me` da `profileId` yo'q**, backendchi hozir API'ni o'zgartira olmaydi. Shuning uchun tayyorlovchi/buyurtmachi **TIN** bilan aniqlanadi (`model/permissions.ts`). LEGAL'da TIN va profil birga-bir mos.
- **Xodimlarda `CADASTRE_PASSPORT` direction yo'q va kerak ham emas.** Workflow endpointlari faqat `INDIVIDUAL` rolini va tashkilotga a'zolikni tekshiradi. Bazada: 3029 ta INDIVIDUAL'ning birortasida yo'q, LEGAL'larning hammasida bor.
  - Shuning uchun INDIVIDUAL uchun kadastr route'lari `id` siz (`individual.ts`), menyu esa a'zolik bo'lsa qo'shiladi (`use-user-navigation.tsx`).
- **Admin endpointlari himoyalangan** — controller klassida `hasAuthority('ADMIN')`. `/org-employees/me` metod darajasida `isAuthenticated()`.
- `/attachments/cadastre-passports` va `GET /users/legal/{tin}` faqat autentifikatsiya talab qiladi — xodimlar ham chaqira oladi.
- **Qo'mita imzosi** uchun testda bitta akkaunt bor: MANAGER `33004912120016` (MASHRAPOV BAHODIR).
- Xodim bir vaqtda **faqat bitta** tashkilot/lavozimda faol bo'la oladi. To'liq oqimni sinash uchun 5 ta alohida INDIVIDUAL akkaunt kerak (FVV: 3, SES: 2) yoki xodimni lavozimlar orasida ko'chirib turish kerak.
- Backendda bu modul uchun kesh yo'q.

## Test bazasi holati (2026-09-14, 02:33)

| Qism             | Holati                                                           |
| ---------------- | ---------------------------------------------------------------- |
| Tashkilotlar     | FVV (201862006), SES (200794614) — admin panel orqali qo'shilgan |
| Lavozimlar       | FVV: "Tekshiruvchi"; SES: "Ijrochi", "Imzolovchi"                |
| Xodimlar         | yo'q                                                             |
| Pog'onalar       | yo'q                                                             |
| Ishtirokchilar   | yo'q                                                             |
| Kadastr pasporti | 1 ta                                                             |

Ishtirokchilar belgilanmaguncha buyurtmachi tasdiqlashi 400 qaytaradi: "Ushbu jarayon uchun ishtirokchi tashkilotlar belgilanmagan".

## Ertaga qilinadigan ishlar

1. **Lavozimlarni hal qilish.** Hozirgilar qo'llanmadagi modeldan farq qiladi:

   - FVV: Ijrochi, Rahbar o'rinbosari, Rahbar;
   - SES: Ijrochi, Rahbar.

   Mavjudlarini qoldiramizmi yoki qo'llanmadagidek qilamizmi — kelishib olish kerak.

2. **Xodimlar:** har bir lavozimga test qila oladigan real INDIVIDUAL akkaunt (JSHSHIR + tug'ilgan sana).
3. **Pog'onalar** (qo'llanma §8.6):
   - FVV: `1 [FILL_DATA, SUBMIT, REJECT]` → `2 [ENDORSE, RETURN→1]` → `3 [SIGN]`
   - SES: `1 [FILL_DATA, SUBMIT, REJECT]` → `2 [SIGN, RETURN→1]`
4. **Ishtirokchilar:** `FVV` o'rni → FVV, `SES` o'rni → SES.
5. **To'liq oqimni sinash:** LEGAL yaratadi → buyurtmachi tasdiqlaydi → FVV va SES xodimlari → qo'mita.
6. Topilgan kamchiliklarni tuzatish. Kod brauzerda hali sinab ko'rilmagan.

## Backend'ni qanday tekshirish mumkin

- **API:** backend manba kodi lokalda yo'q. Test serverdagi `/home/test/back/ecosystem.jar` ni nusxalab olib, class fayllaridan controller yo'llari, `@PreAuthorize`, DTO maydonlari va enum qiymatlari o'qiladi. Jar tez-tez yangilanadi — har safar yangisini oling.
- **Test baza:** `test_db`, serverda `psql` bilan faqat o'qish rejimida (`PGOPTIONS='-c default_transaction_read_only=on'`). Ulanish sozlamalari jar ichidagi `application-test.properties` da.
- **Parol va maxfiy ma'lumotlarni bu faylga yozmang.**

## Asosiy fayllar

| Fayl                                                                | Vazifasi                                        |
| ------------------------------------------------------------------- | ----------------------------------------------- |
| `src/features/cadastre-passport/model/types.ts`                     | API tiplari                                     |
| `src/features/cadastre-passport/model/permissions.ts`               | Tayyorlovchi / buyurtmachi / qo'mita tekshiruvi |
| `src/features/cadastre-passport/model/use-cadastre-passport.ts`     | Pasport, tarix so'rovlari, yangilash            |
| `src/features/cadastre-passport/ui/cadastre-detail.tsx`             | Batafsil sahifa                                 |
| `src/features/cadastre-passport/ui/components/workflow-actions.tsx` | Xodim amallari                                  |
| `src/features/cadastre-passport/ui/components/workflow-cards.tsx`   | Tashkilot kartalari va tarix                    |
| `src/entities/org-membership`                                       | `/org-employees/me`                             |
| `src/features/admin/org-workflow`                                   | Admin panel                                     |
