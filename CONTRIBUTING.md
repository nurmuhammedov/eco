# Kod yozish qoidalari

Bu fayl — loyihada qabul qilingan yagona uslub. Yangi kod shu qoidalarga mos
yozilishi kerak; ko‘pchiligi ESLint bilan tekshiriladi, ya’ni commit paytida
o‘zi ushlab qoladi.

## Tekshirish

```bash
npm run typecheck   # tsc -b — haqiqiy tekshiruv
npm run lint        # eslint, ogohlantirishlarga ham toqat yo‘q
npm run test        # vitest run
npm run build       # typecheck + vite build
```

> `tsc --noEmit` ishlatmang: ildizdagi `tsconfig.json` solution-style, shuning
> uchun u hech narsani tekshirmasdan muvaffaqiyat qaytaradi.

## Qatlamlar (FSD)

```
app → pages → widgets → features → entities → shared
```

Import faqat **pastga** qarab boradi. `shared` hech kimni bilmaydi, `entities`
featurelarni bilmaydi va hokazo. Umumiy tip yoki konstanta ikki qatlamga kerak
bo‘lsa — uni pastki qatlamga chiqaring, komponent fayli ichida qoldirmang.

Buni ESLint tekshiradi (`no-restricted-imports`), ya’ni yuqoriga qaragan import
commitgacha xato beradi. Xato chiqsa — importni “aylanib o‘tish” emas, faylni
to‘g‘ri qatlamga ko‘chirish kerak.

Modul o‘z `index.ts` ini import qilmaydi. Qo‘shni faylni to‘g‘ridan-to‘g‘ri
oling (`./model/types`), aks holda aylanma bog‘lanish hosil bo‘ladi va Rollup
modullarni noto‘g‘ri tartibda ishga tushiradi.

## Nomlash

| Nima           | Qoida                   | Misol                                              |
| -------------- | ----------------------- | -------------------------------------------------- |
| Fayl va papka  | kebab-case              | `use-paginated-data.ts`, `cadastre-list.tsx`       |
| Komponent      | PascalCase              | `CadastreList`                                     |
| Hook           | `use` + kebab-case fayl | `useCadastrePassport` → `use-cadastre-passport.ts` |
| Tip, interfeys | PascalCase              | `CadastrePassportRow`                              |
| Konstanta      | SCREAMING_SNAKE         | `DEFAULT_STALE_TIME`                               |

Nom vazifasini aytsin. `report11`, `ReportsDetail3`, `data2` kabi nomlar
qabul qilinmaydi — marshrut yoki biznes ma’nosidan kelib chiqing
(`registry-deregistrations`).

Importda `.ts` / `.tsx` kengaytmasini yozmang.

## Marshrutlar

Hamma sahifa `src/app/routes/registry.tsx` da **bir marta** yoziladi:

```ts
{ id: 'REGISTRY', path: 'register/:id/hf', element: withSuspense(HfDetail), roles: [UserRoles.INSPECTOR, ...] }
```

- `roles` — qaysi kabinetlarda ko‘rinadi;
- `id` — foydalanuvchining `directions` ida bo‘lishi shart bo‘lgan yo‘nalish;
- yo‘l nisbiy yoziladi (`/` bilan boshlanmaydi);
- sahifa doim `lazy` + `withSuspense` orqali ulanadi.

**Manzil sxemasi** — yangi sahifa shu shaklda yoziladi:

| Nima       | Yo‘l                  | Misol                    |
| ---------- | --------------------- | ------------------------ |
| Ro‘yxat    | `/<toʻplam>`          | `/declarations`          |
| Ko‘rish    | `/<toʻplam>/:id`      | `/declarations/:id`      |
| Qo‘shish   | `/<toʻplam>/add`      | `/declarations/add`      |
| Tahrirlash | `/<toʻplam>/:id/edit` | `/declarations/:id/edit` |

To‘plam nomi **ko‘plikda** va kebab-case da (`/cadastre-passports`).
`detail/:id`, `edit/:id`, `create` shakllari ishlatilmaydi.

Mavjud manzilni o‘zgartirsangiz, eskisini `src/app/routes/legacy-redirects.tsx`
ga qo‘shing — xatcho‘p va eski havolalar sinmasligi kerak.

Menyu `src/widgets/sidebar/models` da. Kim qaysi modulga kira olishini menyu
ham, router ham `src/shared/lib/access/module-access.ts` dan o‘qiydi —
`isModuleInMenu` har doim `canOpenModule` ning qism to‘plami, shuning uchun
menyudagi band hech qachon “topilmadi” sahifasiga olib bormaydi.

## Ma’lumot olish va yuborish

**Bitta yo‘l bor: `apiClient`.** Komponent yoki hook `axios` ni to‘g‘ridan-to‘g‘ri
chaqirmaydi — interceptorlar (xato xabarlari, 401 da chiqib ketish, parametr
tozalash) chetlab o‘tilmasligi kerak. ESLint buni taqiqlaydi.

Odatdagi holatlar uchun `src/shared/hooks/api` dagi hooklar:

| Hook                                                   | Nima qiladi                                     |
| ------------------------------------------------------ | ----------------------------------------------- |
| `useData<T>(endpoint, enabled?, params?)`              | bitta GET                                       |
| `useDetail<T>(endpoint, id)`                           | `endpoint/:id`, `id` bo‘lmasa so‘rov yubormaydi |
| `usePaginatedData<T>(endpoint, params?, enabled?)`     | sahifalangan ro‘yxat, `totalPages` bilan        |
| `useAdd<TVars, TData, TErr>(endpoint)`                 | POST                                            |
| `useUpdate<TVars, TData, TErr>(endpoint, id, method?)` | PUT yoki PATCH                                  |
| `useDelete(endpoint, id?)`                             | DELETE                                          |

Mutatsiyalar **o‘zi invalidatsiya qiladi**: `useAdd('/accidents')` muvaffaqiyatli
tugagach `/accidents` dan oziqlanadigan barcha so‘rovlar yangilanadi. Qo‘lda
`invalidateQueries` yozish shart emas.

Kalitlar `endpointKey(endpoint, ...)` orqali quriladi. O‘zingiz `useQuery`
yozsangiz ham shuni ishlating — aks holda mutatsiya sizning so‘rovingizni
topa olmaydi va ro‘yxat eskirib qoladi.

`useQuery` / `useMutation` ni to‘g‘ridan-to‘g‘ri yozish faqat hooklar qamramagan
holatlar uchun: optimistik yangilash, maxsus `select`, bir nechta so‘rovni
birlashtirish.

## Formalar

`react-hook-form` + `zod`. Sxema komponent yonida, `zodResolver` bilan ulanadi.

Xato matnlari faqat ikkitasi:

- `Majburiy maydon!`
- `Kiritilgan ma’lumot yaroqli emas!`

**Sxemaga matn yozilmaydi.** Ikkalasini `src/shared/validation/zod-setup.ts`
dagi global `errorMap` o‘zi tanlaydi: bo‘shlik (`min(1)`, yo‘q qiymat, tanlanmagan
enum) — birinchisi, format/uzunlik/diapazon — ikkinchisi.

```ts
// to‘g‘ri
factoryNumber: z.string().trim().min(1),
certificateNumber: z.string().regex(CERTIFICATE_NUMBER_PATTERN),

// noto‘g‘ri
factoryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
```

`refine` / `superRefine` / `ctx.addIssue` da errorMap qoidani bilmaydi — u yerda
`FORM_ERROR_MESSAGES.required` yoki `.invalid` aniq yoziladi.

Istisno faqat foydalanuvchi taxmin qila olmaydigan biznes cheklovi uchun
(“bitta qabul vaqtiga ko‘pi bilan 100 ta xodim”). Format namunasi xatoga emas,
**placeholderga** yoziladi.

Placeholderlar: select uchun `Tanlang`, sana uchun `Sanani tanlang`, qolgani
uchun `Kiriting`. Maska bor maydonda namuna ko‘rsatiladi (`60.123456`).

## Matnlar

Interfeys o‘zbekcha. `o‘` va `g‘` da U+2018 (`‘`), tutuq belgisida U+2019 (`’`).
Foydalanuvchiga enum nomi (`REPLY_HF_APPEAL`) yoki inglizcha texnik xabar
ko‘rinmasligi kerak.

Bo‘sh qiymat uchun `<EmptyValue />` — “Mavjud emas”. Maydonni butunlay yashirib
yubormang: o‘quvchi ma’lumot yo‘qligini bilishi kerak.

## Izohlar

Izoh nima qilinayotganini emas, **nega** shunday qilinganini yozadi. Kod o‘zi
aytib turgan narsani takrorlamang. Inglizcha, to‘liq gap bilan.

## Console

`console.log` qolmaydi. `console.warn` va `console.error` ruxsat etilgan.

## Testlar

Vitest + happy-dom + Testing Library. Test fayli sinaladigan fayl yonida turadi:
`endpoint-key.ts` → `endpoint-key.test.ts`.

Nimani sinash kerak: **qoida va hisob-kitob** — kesh kaliti, format va maska,
rol/`Direction` bo‘yicha ko‘rinish, sana yordamchilari. Bu joylar jimgina buziladi
va ko‘zga darrov tashlanmaydi.

Nimani sinamaslik kerak: kutubxonaning o‘z xatti-harakati, shadcn komponentlari,
shunchaki “render bo‘ldimi” degan testlar.

Sinash uchun mantiqni komponent yoki hook ichidan sof funksiyaga chiqarish
ma’qul — `visible-routes.ts` shunday paydo bo‘lgan.

Test nomi ingliz tilida, **nima kafolatlanayotganini** aytadi:
`'needs the matching direction when the page declares one'`, `'returns true'` emas.
