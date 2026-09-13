# Kadastr pasporti — Frontend uchun migratsiya qo'llanmasi

> **Kimga:** Frontend jamoasi
> **Maqsad:** Boshlang'ich `CadastrePassport` API'lariga moslab qilingan frontni backend'ning hozirgi holatiga o'tkazish.
> **Backend commit'lari:** `79311dc9 add organization workflow`, `0cd0545f refactoring cadastre passport review` va xodim konteksti (`allowedActions`, `myTurn`, `/org-employees/me`) qo'shilgan keyingi o'zgarish.
> **Muhim:** DB'da kadastr jadvallari toza qayta yaratilgan, eski ma'lumot yo'q — orqaga moslik (backward compatibility) saqlanmagan.

---

## Mundarija

1. [Nima o'zgardi — qisqa xulosa](#1-nima-ozgardi--qisqa-xulosa)
2. [Rollar va kabinetlar](#2-rollar-va-kabinetlar)
3. [Jarayon (status) oqimi](#3-jarayon-status-oqimi)
4. [Endpoint'lar: oldin → hozir](#4-endpointlar-oldin--hozir)
5. [So'rov va javob tanalari (batafsil)](#5-sorov-va-javob-tanalari-batafsil)
6. [Tashkilot xodimi ekranlari (workflow)](#6-tashkilot-xodimi-ekranlari-workflow)
7. [Rad etilgan pasportni qayta yuborish](#7-rad-etilgan-pasportni-qayta-yuborish)
8. [Admin panel — yangi ekranlar](#8-admin-panel--yangi-ekranlar)
9. [Enum'lar ma'lumotnomasi](#9-enumlar-malumotnomasi)
10. [Xatolar va HTTP kodlar](#10-xatolar-va-http-kodlar)
11. [Migratsiya checklist](#11-migratsiya-checklist)

---

## 1. Nima o'zgardi — qisqa xulosa

| #   | O'zgarish                                                                                                                                                       | Front uchun ta'siri                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **SES va FVV endi bitta LEGAL kabinet emas, pog'onali xodimlar orqali ishlaydi** (ijrochi → o'rinbosar → rahbar).                                               | `fvv-sign` / `ses-sign` o'chirildi. O'rniga `/workflow/*` endpoint'lari va yangi "Mening ishlarim" ekrani.                                                                |
| 2   | **SES/FVV LEGAL kabineti — faqat ko'rish (read-only).**                                                                                                         | Bu kabinetda imzolash/tahrirlash tugmalari olib tashlanadi.                                                                                                               |
| 3   | **Pog'onalar soni va amallar dinamik** (hozir FVV — 3, SES — 2; admin o'zgartira oladi).                                                                        | Pog'ona soni, lavozim nomi va tugmalarni frontda **hardcode qilmang** — hammasi `workflows[]` dan keladi: `allowedActions`, `returnToStep`, `myTurn`.                     |
| 4   | **Ruxsatlar qat'iylashtirildi.**                                                                                                                                | Yaratish/tahrirlash/o'chirish — faqat preparer; imzolash — faqat haqiqiy customer; qo'mita — `MANAGER` + `CADASTRE_PASSPORT`; boshqa tashkilot pasportini ochish → `403`. |
| 5   | **Create so'rovi nested bo'ldi**: 24 ta maydon `preparerData` ichiga o'tdi.                                                                                     | Create formasi payload'ini qayta tuzish.                                                                                                                                  |
| 6   | **`GET /{id}` javobi qayta tuzildi**: yassi maydonlar o'rniga `cadastreData.{preparerData, fvvData, sesData}`, `reviews[]`, `workflows[]`.                      | Batafsil sahifani qayta bog'lash. FVV/SES ma'lumotlari endi **haqiqatan qaytadi** (oldin umuman qaytmasdi).                                                               |
| 7   | **Review'da `organizationType` → `party`**, reviewer ismi va sanasi qo'shildi.                                                                                  | Review ro'yxati komponenti.                                                                                                                                               |
| 8   | **Path parametri**: `{cPassportId}` → `{id}` (URL shakli o'zgarmagan, faqat nomi).                                                                              | Ta'siri yo'q, faqat ma'lumot uchun.                                                                                                                                       |
| 9   | **Qayta yuborish (parent)**: javobda `parentCadastrePassportId`.                                                                                                | "Oldin yuborilgan pasportni ko'rish" havolasi.                                                                                                                            |
| 10  | **Barcha imzo endpoint'lari endi `ApiResponse` qaytaradi** (oldin `fvv-sign`, `ses-sign`, `committee-sign` bo'sh tana qaytarardi).                              | Javob parser'lari.                                                                                                                                                        |
| 11  | **Xodim konteksti API'da**: `GET /api/v1/org-employees/me` (foydalanuvchi qaysi tashkilot/lavozimda), `myTurn` (ro'yxat, batafsil, har bir tashkilot jarayoni). | Menyu, "Mening navbatim" belgisi va tugmalarni shu ma'lumotlar bilan boshqarish.                                                                                          |
| 12  | **Yangi admin bo'limi**: hamkor tashkilotlar, lavozimlar, xodimlar, pog'onalar, ishtirokchilar.                                                                 | Admin panelga yangi ekranlar.                                                                                                                                             |

---

## 2. Rollar va kabinetlar

Autentifikatsiya o'zgarmagan (OneID, JWT cookie). Foydalanuvchi turi `role` va `directions` orqali, tashkilot xodimi ekanligi esa **`GET /api/v1/org-employees/me`** orqali aniqlanadi.

| Kim                                                | `role`                                    | Qanday aniqlanadi                                       | Pasportlar bilan nima qila oladi                                                                                |
| -------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Preparer** (pasportni tayyorlovchi)              | `LEGAL`                                   | `passport.preparerProfileId == me.profileId`            | Yaratish; `NEW` holatda tahrirlash va o'chirish; qayta yuborish                                                 |
| **Customer** (buyurtmachi)                         | `LEGAL`                                   | `passport.customerProfileId == me.profileId`            | `NEW` holatda e-imzo bilan tasdiqlash yoki rad etish. **Preparer va customer bitta tashkilot bo'lishi mumkin.** |
| **SES / FVV LEGAL kabineti**                       | `LEGAL`                                   | Ro'yxatda o'z tashkilotiga tushgan pasportlarni ko'radi | **Faqat ko'rish**: ro'yxat, batafsil, PDF preview. Hech qanday amal yo'q.                                       |
| **SES / FVV xodimi** (ijrochi, o'rinbosar, rahbar) | `INDIVIDUAL`                              | `GET /org-employees/me` → `data !== null`               | O'z navbatidagi amallar (§6). O'z tashkilotiga tushgan pasportlarni ko'radi.                                    |
| **Qo'mita mas'ul menejeri**                        | `MANAGER` + direction `CADASTRE_PASSPORT` | `me.role` va `me.directions`                            | `IN_COMMITTEE` holatda yakuniy imzo yoki rad etish. Barcha pasportlarni ko'radi.                                |
| **Boshqa qo'mita xodimlari**                       | ichki rollar                              | —                                                       | Barcha pasportlarni ko'radi                                                                                     |
| **Admin**                                          | `ADMIN`                                   | —                                                       | Workflow sozlamalari (§8)                                                                                       |

> **Eslatma:** preparer ham, customer ham **faqat `LEGAL`** bo'la oladi. `INDIVIDUAL` foydalanuvchi pasport yarata olmaydi (`403`).

---

## 3. Jarayon (status) oqimi

`CadastrePassportStatus` qiymatlari **o'zgarmagan**: `NEW`, `IN_REVIEW`, `IN_COMMITTEE`, `APPROVED`, `REJECTED`.

```
 LEGAL preparer
     │  POST /cadastre-passports
     ▼
   NEW ──(preparer tahrirlaydi / o'chiradi)
     │
     │  LEGAL customer: POST /{id}/customer-sign
     ├── REJECTED  (signAction=REJECTED, sabab majburiy)
     ▼
 IN_REVIEW ── SES va FVV **parallel**, bir-biriga bog'liq emas
     │
     │   FVV:  ijrochi (ma'lumot + yuborish) → o'rinbosar (kelishish / qaytarish) → rahbar (e-imzo)
     │   SES:  ijrochi (ma'lumot + yuborish) → rahbar (e-imzo / qaytarish)
     │
     ├── REJECTED  (istalgan tomonning ijrochisi rad etsa — butun pasport shu zahoti rad etiladi,
     │              ikkinchi tomon jarayoni avtomatik bekor qilinadi)
     ▼  (ikkala tomon rahbari imzolagach, avtomatik)
 IN_COMMITTEE
     │  MANAGER: POST /{id}/committee-sign
     ├── REJECTED
     ▼
 APPROVED  (registryNumber beriladi, titul varag'ida yakuniy QR paydo bo'ladi)
```

**Muhim farqlar oldingisidan:**

- `IN_REVIEW` ichida endi **har bir tashkilotning o'z holati** bor — `workflows[]` massivida (§5.3).
- "Qaytarish" (`RETURN`) pasport statusini o'zgartirmaydi — faqat tashkilot ichida ishni oldingi pog'onaga qaytaradi.

---

## 4. Endpoint'lar: oldin → hozir

Base URL o'zgarmagan: `/api/v1/cadastre-passports`

### 4.1. `CadastrePassport` endpoint'lari

| Oldin                                | Hozir                              | Holat                                                                                                             | Kim chaqiradi                 |
| ------------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `POST /`                             | `POST /`                           | ⚠️ **Tana o'zgardi** (§5.1)                                                                                       | LEGAL preparer                |
| `PUT /{id}/preparer-cadastre-data`   | `PUT /{id}/preparer-cadastre-data` | ✅ Tana shakli bir xil; endi faqat preparer va faqat `NEW`                                                        | LEGAL preparer                |
| `DELETE /{id}`                       | `DELETE /{id}`                     | ✅ Endi faqat preparer va faqat `NEW`                                                                             | LEGAL preparer                |
| `POST /{cPassportId}/customer-sign`  | `POST /{id}/customer-sign`         | ✅ Tana bir xil; rad etishda `dto.conclusion` **majburiy** bo'ldi; javob `message` endi to'ldirilgan              | LEGAL customer                |
| `POST /{cPassportId}/fvv-sign`       | —                                  | ❌ **O'chirildi**                                                                                                 | —                             |
| `POST /{cPassportId}/ses-sign`       | —                                  | ❌ **O'chirildi**                                                                                                 | —                             |
| `PUT /{id}/fvv-cadastre-data`        | `PUT /{id}/workflow/fvv-data`      | 🔁 **URL o'zgardi**, tana bir xil                                                                                 | FVV ijrochisi (INDIVIDUAL)    |
| `PUT /{id}/ses-cadastre-data`        | `PUT /{id}/workflow/ses-data`      | 🔁 **URL o'zgardi**, tana bir xil                                                                                 | SES ijrochisi (INDIVIDUAL)    |
| —                                    | `POST /{id}/workflow/submit`       | 🆕 Ijrochi xulosani keyingi pog'onaga yuboradi                                                                    | Ijrochi                       |
| —                                    | `POST /{id}/workflow/endorse`      | 🆕 Imzosiz kelishish (viza)                                                                                       | O'rinbosar                    |
| —                                    | `POST /{id}/workflow/return`       | 🆕 Sabab bilan oldingi pog'onaga qaytarish                                                                        | O'rinbosar, SES rahbari       |
| —                                    | `POST /{id}/workflow/reject`       | 🆕 Butun pasportni rad etish                                                                                      | Ijrochi                       |
| —                                    | `POST /{id}/workflow/sign`         | 🆕 Tashkilot rahbarining shaxsiy e-imzosi                                                                         | Rahbar                        |
| `POST /{cPassportId}/committee-sign` | `POST /{id}/committee-sign`        | ✅ Tana bir xil; **javob endi `ApiResponse`** (oldin bo'sh edi)                                                   | MANAGER + `CADASTRE_PASSPORT` |
| `GET /{id}`                          | `GET /{id}`                        | ⚠️ **Javob qayta tuzildi** (§5.3)                                                                                 | Ruxsati borlar                |
| `GET /`                              | `GET /`                            | ✅ Parametrlar bir xil; javobga `parentCadastrePassportId` va `myTurn` qo'shildi; ro'yxat rolga qarab filtrlanadi | Hamma                         |
| `GET /{id}/preview-pdf`              | `GET /{id}/preview-pdf`            | ✅ Endi faqat ruxsati borlar                                                                                      | Ruxsati borlar                |

### 4.2. Yangi: xodim uchun endpoint'lar

| Endpoint                                                                                      | Kim                                | Vazifasi                                                                   |
| --------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| `GET /api/v1/org-employees/me`                                                                | Autentifikatsiyadan o'tgan har kim | Joriy foydalanuvchining tashkilot va lavozimi. Xodim bo'lmasa `data: null` |
| `GET /api/v1/workflow-instances/my-tasks?page=1&size=10&processType=CADASTRE_PASSPORT_REVIEW` | INDIVIDUAL xodim                   | Hozir aynan shu xodimning navbatida turgan ishlar                          |
| `GET /api/v1/workflow-instances/{instanceId}/history`                                         | Autentifikatsiyadan o'tgan         | Tashkilot ichidagi harakatlar tarixi (kim, qachon, nima qildi, sabab)      |

### 4.3. Yangi: admin endpoint'lari

§8 da batafsil.

---

## 5. So'rov va javob tanalari (batafsil)

Barcha javoblar avvalgidek `ApiResponse` ichida:

```json
{ "message": "Ok", "errors": null, "data": { ... }, "success": true }
```

Sanalar: `"YYYY-MM-DD"`, vaqt: ISO `"2026-09-13T10:15:30"`. Enum'lar **nomi bilan** (string) keladi va yuboriladi.

### 5.1. `POST /api/v1/cadastre-passports` — yaratish

**Oldin** — hammasi bitta darajada:

```json
{
  "customerTin": 305123456,
  "detailFilePath": "/uploads/...",
  "passportFilePath": "/uploads/...",
  "parentRequestNumber": null,
  "name": "...",
  "organizationalBelonging": "...",
  "address": "...",
  "...": "... (yana 21 ta maydon)",
  "healthRiskFactor": "..."
}
```

**Hozir** — 24 ta kadastr maydoni `preparerData` ichida:

```json
{
  "customerTin": 305123456,
  "detailFilePath": "/uploads/...",
  "passportFilePath": "/uploads/...",
  "parentRequestNumber": null,
  "preparerData": {
    "name": "Neft bazasi",
    "organizationalBelonging": "...",
    "address": "...",
    "latitude": 41.311081,
    "longitude": 69.240562,
    "landCadastreNumber": "...",
    "cadastreRegistrationDate": "2024-05-18",
    "cadastreRegistrationNumber": "...",
    "landArea": 1250.5,
    "purpose": "...",
    "substance": "...",
    "status": "ACTIVE",
    "exploitationDate": "2010-01-01",
    "protectionDistance": "...",
    "employeeCount": 120,
    "workingHour": 8,
    "distanceToResidence": 1.2,
    "distanceToNearestObject": 0.5,
    "distanceToFireDepartment": 3.4,
    "firefightingEquipment": "...",
    "damageArea": 500,
    "dominantHazardType": "...",
    "estimatedValue": 1000000,
    "healthRiskFactor": "..."
  }
}
```

**O'zgarish nuqtalari:**

- Maydon nomlari **bir xil**, faqat `preparerData` obyektiga o'tdi. `status` (oldin `CadastreDataStatus`) ham `preparerData.status`.
- `preparerData` barcha maydonlari majburiy. Validatsiya xatolari `errors` da `preparerData.name` ko'rinishidagi kalit bilan keladi.
- Validatsiya xabarlari endi o'zbek tilida.
- `customerTin` — tizimda ro'yxatdan o'tgan **LEGAL** bo'lishi shart, aks holda `400`.
- `parentRequestNumber` — faqat qayta yuborishda (§7).
- Javob: `{ "message": "Muvaffaqiyatli saqlandi" }` (oldingidek; yaratilgan `id` qaytmaydi).

### 5.2. `PUT /{id}/preparer-cadastre-data`

Tana **bir xil** — 24 ta maydon, **yassi** holda (`preparerData` bilan o'ralmaydi):

```json
{ "name": "...", "organizationalBelonging": "...", "...": "...", "healthRiskFactor": "..." }
```

Faqat preparer va faqat `NEW` holatda.

### 5.3. `GET /api/v1/cadastre-passports/{id}` — batafsil

**Oldin:**

```json
{
  "id": "...",
  "requestNumber": "...",
  "registryNumber": null,
  "preparerProfileId": "...",
  "preparerTin": 0,
  "customerProfileId": "...",
  "customerTin": 0,
  "detailFilePath": "...",
  "passportFilePath": "...",
  "titlePagePath": "...",
  "status": "IN_REVIEW",
  "reviews": [
    {
      "cadastrePassportId": "...",
      "organizationType": "FVV",
      "signAction": "APPROVED",
      "conclusion": "...",
      "conclusionFilePath": "..."
    }
  ],
  "name": "...",
  "organizationalBelonging": "...",
  "cadastreDataStatus": "ACTIVE",
  "...": "... (preparer maydonlari yassi holda; FVV/SES maydonlari UMUMAN YO'Q edi)"
}
```

**Hozir:**

```json
{
  "id": "5b0c...",
  "requestNumber": "REQ-1757750000000",
  "registryNumber": null,
  "parentCadastrePassportId": null,
  "preparerProfileId": "...",
  "preparerTin": 301234567,
  "customerProfileId": "...",
  "customerTin": 305123456,
  "detailFilePath": "...",
  "passportFilePath": "...",
  "titlePagePath": "...",
  "status": "IN_REVIEW",
  "myTurn": true,

  "cadastreData": {
    "preparerData": { "name": "...", "status": "ACTIVE", "...": "24 ta maydon" },
    "fvvData": { "dailyEmployeeCount": 40, "fireExplosionCategory": "B", "...": "33 ta maydon" },
    "sesData": null
  },

  "reviews": [
    {
      "party": "CUSTOMER",
      "signAction": "APPROVED",
      "conclusion": "...",
      "conclusionFilePath": "...",
      "reviewerProfileId": "...",
      "reviewerName": "\"ABC\" MChJ",
      "createdAt": "2026-09-13T10:15:30"
    }
  ],

  "workflows": [
    {
      "id": "a1f3...",
      "processType": "CADASTRE_PASSPORT_REVIEW",
      "slot": "FVV",
      "businessId": "5b0c...",
      "orgId": "...",
      "orgName": "Favqulodda vaziyatlar vazirligi",
      "currentStep": 2,
      "totalSteps": 3,
      "currentPositionName": "Rahbar o'rinbosari",
      "allowedActions": ["ENDORSE", "RETURN"],
      "returnToStep": 1,
      "status": "IN_PROGRESS",
      "assigneeProfileId": "...",
      "myTurn": true
    },
    {
      "id": "b7c9...",
      "processType": "CADASTRE_PASSPORT_REVIEW",
      "slot": "SES",
      "businessId": "5b0c...",
      "orgId": "...",
      "orgName": "Sanitariya-epidemiologiya xizmati",
      "currentStep": 1,
      "totalSteps": 2,
      "currentPositionName": "Ijrochi",
      "allowedActions": ["FILL_DATA", "SUBMIT", "REJECT"],
      "returnToStep": null,
      "status": "IN_PROGRESS",
      "assigneeProfileId": null,
      "myTurn": false
    }
  ]
}
```

**Maydonlar xaritasi (eski → yangi):**

| Oldin                                              | Hozir                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------ |
| `name`, `address`, ... (yassi preparer maydonlari) | `cadastreData.preparerData.name`, `...`                                        |
| `cadastreDataStatus`                               | `cadastreData.preparerData.status`                                             |
| _(yo'q edi)_                                       | `cadastreData.fvvData` — FVV to'ldirmagan bo'lsa `null`                        |
| _(yo'q edi)_                                       | `cadastreData.sesData` — SES to'ldirmagan bo'lsa `null`                        |
| `reviews[].organizationType`                       | `reviews[].party`                                                              |
| `reviews[].cadastrePassportId`                     | olib tashlandi (ota obyektda `id` bor)                                         |
| _(yo'q edi)_                                       | `reviews[].reviewerName`, `reviews[].reviewerProfileId`, `reviews[].createdAt` |
| _(yo'q edi)_                                       | `workflows[]`                                                                  |
| _(yo'q edi)_                                       | `parentCadastrePassportId`                                                     |
| _(yo'q edi)_                                       | `myTurn`                                                                       |

**`workflows[]` elementi maydonlari:**

| Maydon                       | Ma'nosi                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                         | Workflow instance ID — `history` va ichki kalit uchun                                                                                       |
| `slot`                       | `FVV` yoki `SES` — qaysi tashkilot tomoni                                                                                                   |
| `orgName`                    | Tashkilot nomi                                                                                                                              |
| `currentStep` / `totalSteps` | Joriy pog'ona va jami pog'onalar soni (progress uchun)                                                                                      |
| `currentPositionName`        | Ish hozir kimda (lavozim nomi)                                                                                                              |
| `allowedActions`             | **Joriy pog'onada ruxsat etilgan amallar.** Jarayon tugagan bo'lsa (`status !== IN_PROGRESS`) — bo'sh massiv                                |
| `returnToStep`               | `RETURN` bosilganda ish qaysi pog'onaga qaytadi. `RETURN` yo'q yoki jarayon tugagan bo'lsa — `null`                                         |
| `status`                     | `IN_PROGRESS` / `COMPLETED` / `REJECTED` / `CANCELLED`                                                                                      |
| `assigneeProfileId`          | Ijrochi pog'onasida ishni olgan xodim                                                                                                       |
| `myTurn`                     | **Joriy foydalanuvchi hozir bu jarayonda amal bajara oladimi** (to'g'ri tashkilot + to'g'ri lavozim + ish boshqa ijrochiga biriktirilmagan) |

**Yuqori darajadagi `myTurn`** — `workflows[]` dan birortasida `myTurn: true` bo'lsa `true`.

**UI tavsiyalari:**

- **Ma'lumot bo'limlari**: `preparerData`, `fvvData`, `sesData` ni alohida tab/karta sifatida ko'rsating. `null` bo'lsa "Hali to'ldirilmagan".
- **Tashkilotlar progressi**: har bir `workflows[]` elementi uchun: `orgName`, `currentStep / totalSteps` progress, `currentPositionName` ("hozir kimda"), `status`.
  - `status`: `IN_PROGRESS` — jarayonda; `COMPLETED` — rahbar imzolagan; `REJECTED` — shu tashkilot rad etgan; `CANCELLED` — boshqa tashkilot rad etgani uchun bekor qilingan.
- `workflows[]` — pasport customer tomonidan tasdiqlanmaguncha **bo'sh massiv**.
- **Review'lar** — titul varag'iga xulosa/imzo qo'ygan tomonlar (CUSTOMER, FVV, SES, COMMITTEE). Oraliq pog'onalar (ijrochi, o'rinbosar) bu yerda ko'rinmaydi — ular `history` da (§6.5).

### 5.4. `GET /api/v1/cadastre-passports` — ro'yxat

- Query parametrlari **bir xil**: `page`, `size`, `requestNumber`, `registryNumber`, `status`, `preparerTin`, `customerTin`, `preparerProfileId`, `customerProfileId`.
- Javob elementiga qo'shildi:
  - `parentCadastrePassportId`;
  - `myTurn` — joriy xodimning navbatida turgan pasportlar uchun `true` (xodim bo'lmaganlar uchun doim `false`). Ro'yxatda "Sizning navbatingiz" badge'i uchun.
- **Filtrlash endi backend'da rolga qarab avtomatik**:
  - preparer/customer — faqat o'zi ishtirok etgan pasportlar;
  - SES/FVV (LEGAL kabineti ham, xodimlari ham) — faqat o'z tashkilotiga tushgan pasportlar (ya'ni customer tasdiqlagandan keyingilar);
  - qo'mita xodimlari — hammasi.

### 5.5. `POST /{id}/customer-sign`

Tana **bir xil** (`NewSignedDto`):

```json
{
  "filePath": "/cadastres/passports/...",
  "sign": "<PKCS7>",
  "signAction": "APPROVED",
  "dto": { "conclusion": "...", "conclusionFilePath": "..." }
}
```

- Faqat pasportning **haqiqiy customer'i** (boshqa LEGAL → `403`).
- `signAction: "REJECTED"` bo'lsa `dto.conclusion` **majburiy** (`400` "Rad etish sababi yozilmadi").
- Javob: `{ "message": "Muvaffaqiyatli bajarildi", "success": true }` (oldin `message` bo'sh edi).

### 5.6. `POST /{id}/committee-sign`

Tana **bir xil** (`NewSignedDto<{conclusion, conclusionFilePath}>`, ikkala maydon majburiy).

- Faqat `role = MANAGER` **va** `directions` ichida `CADASTRE_PASSPORT` bor foydalanuvchi. Tugmani ham shu shart bilan ko'rsating.
- **Javob o'zgardi**: oldin bo'sh tana (`200` + body yo'q), hozir `ApiResponse` (`message: "Muvaffaqiyatli bajarildi"`).

---

## 6. Tashkilot xodimi ekranlari (workflow)

Bu **butunlay yangi** qism. SES va FVV xodimlari `INDIVIDUAL` roli bilan OneID orqali kiradi.

### 6.1. Foydalanuvchi xodimmi? — `GET /api/v1/org-employees/me`

Login'dan keyin (masalan `/users/me` bilan birga) bir marta chaqiring va saqlab qo'ying.

Xodim bo'lsa:

```json
{
  "data": {
    "employeeId": "...",
    "orgId": "...",
    "orgCode": "FVV",
    "orgName": "Favqulodda vaziyatlar vazirligi",
    "positionId": "...",
    "positionCode": "DEPUTY",
    "positionName": "Rahbar o'rinbosari"
  },
  "success": true
}
```

Xodim bo'lmasa (yoki tashkiloti nofaol bo'lsa): `{ "data": null, "success": true }`.

- `data !== null` → menyuga **"Mening ishlarim"** bo'limini qo'shing, profil qismida tashkilot va lavozimni ko'rsating.
- `orgCode` / `positionCode` — admin kiritgan kodlar. Ular faqat ko'rsatish uchun: **tugmalar mantig'ini ularga bog'lamang** (§6.4).

### 6.2. "Mening ishlarim"

`GET /api/v1/workflow-instances/my-tasks?page=1&size=10&processType=CADASTRE_PASSPORT_REVIEW`

```json
{
  "data": {
    "content": [
      {
        "id": "a1f3...",
        "processType": "CADASTRE_PASSPORT_REVIEW",
        "slot": "FVV",
        "businessId": "5b0c...",
        "orgId": "...",
        "orgName": "Favqulodda vaziyatlar vazirligi",
        "currentStep": 1,
        "totalSteps": 3,
        "currentPositionName": "Ijrochi",
        "allowedActions": ["FILL_DATA", "SUBMIT", "REJECT"],
        "returnToStep": null,
        "status": "IN_PROGRESS",
        "assigneeProfileId": null,
        "myTurn": true
      }
    ],
    "totalElements": 1,
    "...": "Spring Page"
  }
}
```

- `businessId` — bu **pasport ID**. Ro'yxatdan bosilganda `GET /api/v1/cadastre-passports/{businessId}` ni oching.
- Ro'yxatda **faqat hozir shu xodim navbatidagi** ishlar bo'ladi (hammasida `myTurn: true`). Ijrochi pog'onasida ish uni birinchi olgan ijrochiga biriktiriladi (`assigneeProfileId`), boshqa ijrochilarda u ko'rinmay qoladi.
- Foydalanuvchi xodim bo'lmasa → `403` (§6.1 bilan oldindan tekshirib, chaqirmaslik kerak).

### 6.3. Amallar — endpoint va tanalar

Hammasi `INDIVIDUAL` roli bilan, pasport `IN_REVIEW` holatida bo'lishi kerak.

| Amal (`allowedActions` qiymati) | Endpoint                                                | Tana                                                                       | Muvaffaqiyatli `message`       |
| ------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| **FILL_DATA** (`slot = FVV`)    | `PUT /api/v1/cadastre-passports/{id}/workflow/fvv-data` | `CadastreFvvSection` (33 ta maydon, hammasi ixtiyoriy)                     | "Muvaffaqiyatli o'zgartirildi" |
| **FILL_DATA** (`slot = SES`)    | `PUT /api/v1/cadastre-passports/{id}/workflow/ses-data` | `CadastreSesSection` (7 ta maydon, ixtiyoriy)                              | "Muvaffaqiyatli o'zgartirildi" |
| **SUBMIT**                      | `POST .../{id}/workflow/submit`                         | `{ "conclusion": "...", "conclusionFilePath": "..." }` — ikkalasi majburiy | "Muvaffaqiyatli bajarildi"     |
| **ENDORSE**                     | `POST .../{id}/workflow/endorse`                        | _tana yo'q_                                                                | "Muvaffaqiyatli tasdiqlandi"   |
| **RETURN**                      | `POST .../{id}/workflow/return`                         | `{ "reason": "..." }` — majburiy                                           | "Muvaffaqiyatli qaytarildi"    |
| **REJECT**                      | `POST .../{id}/workflow/reject`                         | `{ "reason": "..." }` — majburiy                                           | "Muvaffaqiyatli rad etildi"    |
| **SIGN**                        | `POST .../{id}/workflow/sign`                           | `{ "sign": "<PKCS7>" }` — majburiy                                         | "Muvaffaqiyatli tasdiqlandi"   |

**FVV ma'lumot formasi maydonlari** (oldingi `fvv-sign` dto'sidagi bilan bir xil, faqat `conclusion` / `conclusionFilePath` endi alohida `submit` da):
`dailyEmployeeCount`, `sanitaryZone`, `potentiallyAffectedPeopleCount`, `lightVehiclesCount`, `heavyVehiclesCount`, `busesCount`, `bulldozersCount`, `otherVehiclesCount`, `protectiveGear`, `notificationStatus`, `evacuationAddress`, `evacuationInvolvedPeopleCount`, `fireExplosionCategory`, `fireResistanceClass`, `combustibleProductName`, `floorsCount`, `distanceToNearestWater`, `distanceToDistrictFireDept`, `automaticFireAlarmArea`, `voiceAlarmSystem`, `emergencyFireSystem`, `primaryFireEquipment`, `fireTrucksCount`, `specialVehiclesCount`, `heatingSystemType`, `fireExtinguishingAgentType`, `smokeExtractionSystem`, `airSupplySystem`, `protectionArea`, `fireHydrantsCount`, `waterConsumption`, `pumpsCount`, `pumpCapacity`.

**SES ma'lumot formasi maydonlari:**
`responsiblePerson`, `annualProductionCapacity`, `hazardLevel`, `productStorageLocation`, `sanitaryPassportDate`, `sanitaryPassportExpiryDate`, `conservationOrReconstructionInfo`.

> ⚠️ `PUT .../fvv-data` va `.../ses-data` bo'limni **to'liq almashtiradi** (PATCH emas). Formani har doim to'liq yuboring — yuborilmagan maydon `null` bo'ladi.

**Oldingi FVV/SES oqimi bilan taqqoslash:**

| Oldin (bitta LEGAL, bitta so'rov)                                          | Hozir (pog'onali)                                                                                      |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `POST /fvv-sign` bitta so'rovda: ma'lumot + xulosa + `signAction` + e-imzo | 1) ijrochi `PUT /workflow/fvv-data` (ma'lumot, istalgancha saqlash mumkin)                             |
|                                                                            | 2) ijrochi `POST /workflow/submit` (xulosa + fayl) — **avval FVV bo'limi to'ldirilgan bo'lishi shart** |
|                                                                            | 3) o'rinbosar `POST /workflow/endorse` yoki `POST /workflow/return`                                    |
|                                                                            | 4) rahbar `POST /workflow/sign` (faqat `sign`)                                                         |
| `signAction: "REJECTED"` bilan rad etish                                   | Ijrochi `POST /workflow/reject` (`reason`) — **imzosiz**                                               |

### 6.4. Tugmalar mantig'i

Pasport batafsil sahifasida (`GET /{id}` javobi bo'yicha):

```ts
const myWorkflow = passport.workflows.find((w) => w.myTurn)

if (!myWorkflow) {
  // Amal tugmalari yo'q — faqat ko'rish rejimi
} else {
  const actions = new Set(myWorkflow.allowedActions)

  showDataForm = actions.has('FILL_DATA') // myWorkflow.slot bo'yicha FVV yoki SES formasi
  showSubmit = actions.has('SUBMIT') // "Xulosa bilan yuborish" (conclusion + fayl)
  showReject = actions.has('REJECT') // "Rad etish" (reason modal)
  showEndorse = actions.has('ENDORSE') // "Kelishish"
  showReturn = actions.has('RETURN') // "Qaytarish" (reason modal)
  showSign = actions.has('SIGN') // "E-imzo bilan tasdiqlash"

  returnHint = showReturn ? `Ish ${myWorkflow.returnToStep}-pog'onaga qaytadi` : null
}
```

- **Lavozim nomi, kod yoki pog'ona raqamiga qarab tugma ko'rsatmang** — admin pog'onalarni o'zgartirsa front o'zi moslashadi.
- Har bir amaldan keyin `GET /{id}` ni qayta yuklang: `workflows[]`, `myTurn`, `titlePagePath` yangilanadi.
- Server baribir tekshiradi: noto'g'ri pog'ona/lavozim → `403`, ruxsat etilmagan amal → `400`. Bir vaqtda boshqa xodim amal bajarib qo'ygan bo'lsa ham shunday xato keladi — foydalanuvchiga "Sahifani yangilang" deb ko'rsating.

**Rahbar imzosi (`SIGN`) uchun:**

1. Ijrochi xulosasini ko'rsating: `history` dagi oxirgi `SUBMIT` yozuvining `comment` (xulosa) va `filePath` (xulosa fayli).
2. `titlePagePath` dagi PDF'ni ko'rsating va uni e-imzo bilan imzolang (oldingi `fvv-sign` / `ses-sign` dagi imzolash oqimi bilan bir xil).
3. Yuboriladigan tana endi faqat `{ "sign": "..." }` — `filePath`, `signAction`, `dto` **yuborilmaydi**.
4. `GET /{id}` ni qayta yuklang.

### 6.5. Harakatlar tarixi

`GET /api/v1/workflow-instances/{instanceId}/history` (`instanceId` = `workflows[].id` yoki `my-tasks[].id`)

```json
{
  "data": [
    {
      "stepOrder": 1,
      "action": "FILL_DATA",
      "actorProfileId": "...",
      "actorName": "Aliyev Vali",
      "positionName": "Ijrochi",
      "comment": null,
      "filePath": null,
      "signatureId": null,
      "createdAt": "2026-09-13T09:00:00"
    },
    {
      "stepOrder": 1,
      "action": "SUBMIT",
      "actorName": "Aliyev Vali",
      "positionName": "Ijrochi",
      "comment": "Kamchilik aniqlanmadi",
      "filePath": "/uploads/xulosa.pdf",
      "createdAt": "..."
    },
    {
      "stepOrder": 2,
      "action": "RETURN",
      "actorName": "Karimov Sardor",
      "positionName": "Rahbar o'rinbosari",
      "comment": "Evakuatsiya manzili noto'g'ri",
      "createdAt": "..."
    }
  ]
}
```

Tavsiya: pasport sahifasida har bir tashkilot kartasida "Tarix" (timeline) — ayniqsa `RETURN` sabablarini ijrochiga ko'rsatish uchun.

---

## 7. Rad etilgan pasportni qayta yuborish

Oqim **o'zgarmagan** — preparer yangi pasport yaratishda eski pasportning `requestNumber` ini yuboradi:

```json
{ "customerTin": 305123456, "parentRequestNumber": "REQ-1757750000000", "...": "...", "preparerData": {} }
```

**Yangi tekshiruvlar (backend xatolari `400`):**

| Shart                                          | Xato matni                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Parent statusi `REJECTED` bo'lishi kerak       | "Faqat rad etilgan kadastr pasportini qayta yuborish mumkin"                                    |
| Preparer va customer parent'dagi bilan bir xil | "Qayta yuborishda tayyorlovchi va buyurtmachi avvalgi pasportdagi bilan bir xil bo'lishi kerak" |
| Bitta parent'ga faqat bitta qayta yuborish     | "Ushbu so'rov bo'yicha qayta yuborilgan pasport allaqachon mavjud"                              |

**Frontda qilish kerak:**

- "Qayta yuborish" tugmasini faqat `status === "REJECTED"` va `preparerProfileId === me.profileId` bo'lganda ko'rsating.
- Eski ma'lumotlar **nusxalanmaydi** — forma bo'sh ochiladi (backend talabi). Front xohlasa foydalanuvchiga eski pasportni yonma-yon ko'rsatishi mumkin.
- Ro'yxat va batafsil javobda `parentCadastrePassportId` bo'lsa — **"Oldin yuborilgan pasportni ko'rish"** havolasi → `GET /api/v1/cadastre-passports/{parentCadastrePassportId}`.

---

## 8. Admin panel — yangi ekranlar

Quyidagi endpoint'lar faqat `role = ADMIN` (bundan mustasno: `GET /api/v1/org-employees/me` — hamma uchun, §6.1). Sozlash **shu tartibda** bajariladi (har bir keyingi qadam oldingisiga bog'liq):

### 8.1. Hamkor tashkilotlar — `/api/v1/partner-orgs`

| Metod  | URL                | Tana / javob                                                                |
| ------ | ------------------ | --------------------------------------------------------------------------- |
| `POST` | `/`                | `{ "tin": 201862006, "code": "FVV" }` — TIN tizimdagi profil bo'lishi kerak |
| `GET`  | `/`                | `[{ id, profileId, tin, name, code, isActive }]`                            |
| `PUT`  | `/{id}/activate`   | —                                                                           |
| `PUT`  | `/{id}/deactivate` | —                                                                           |

### 8.2. Lavozimlar — `/api/v1/org-positions`

| Metod  | URL           | Tana / javob                                                |
| ------ | ------------- | ----------------------------------------------------------- |
| `POST` | `/`           | `{ "orgId": "...", "code": "EXECUTOR", "name": "Ijrochi" }` |
| `GET`  | `/?orgId=...` | `[{ id, orgId, code, name }]`                               |

### 8.3. Tashkilot xodimlari — `/api/v1/org-employees`

| Metod  | URL                                             | Tana / javob                                                                                 |
| ------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `POST` | `/`                                             | `{ "orgId": "...", "positionId": "...", "pin": 12345678901234, "birthDate": "1990-05-18" }`  |
| `GET`  | `/?page=1&size=10&orgId=&positionId=&isActive=` | Page: `{ id, orgId, orgName, positionId, positionName, profileId, fullName, pin, isActive }` |
| `PUT`  | `/{id}/deactivate`                              | —                                                                                            |

- Shaxs tizimda bo'lmasa, PINFL + tug'ilgan sana bo'yicha avtomatik yaratiladi.
- Bitta shaxs bir vaqtda faqat **bitta** tashkilot/lavozimda aktiv bo'ladi. Lavozimini o'zgartirish: avval `deactivate`, keyin yangi `POST`.

### 8.4. Jarayon pog'onalari — `/api/v1/workflow-definitions`

| Metod  | URL                | Tana / javob                                                                                                                      |
| ------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/`                | quyida                                                                                                                            |
| `GET`  | `/?orgId=...`      | `[{ id, processType, orgId, version, isActive, steps: [{ stepOrder, positionId, positionName, allowedActions, returnToStep }] }]` |
| `PUT`  | `/{id}/deactivate` | —                                                                                                                                 |

```json
{
  "processType": "CADASTRE_PASSPORT_REVIEW",
  "orgId": "<FVV orgId>",
  "steps": [
    { "stepOrder": 1, "positionId": "<EXECUTOR>", "allowedActions": ["FILL_DATA", "SUBMIT", "REJECT"] },
    { "stepOrder": 2, "positionId": "<DEPUTY>", "allowedActions": ["ENDORSE", "RETURN"], "returnToStep": 1 },
    { "stepOrder": 3, "positionId": "<HEAD>", "allowedActions": ["SIGN"] }
  ]
}
```

- Ta'rifni **tahrirlab bo'lmaydi** — yangi `POST` yangi versiya yaratadi va eskisini avtomatik nofaol qiladi. Jarayondagi pasportlar eski versiyada tugaydi.
- Backend validatsiyasi (`400`): pog'onalar 1 dan uzluksiz; har bir pog'onada oldinga siljituvchi amal (`SUBMIT`/`ENDORSE`/`SIGN`); `SIGN` faqat oxirgi pog'onada; bu jarayonning oxirgi pog'onasida **faqat** `SIGN`; `RETURN` bo'lsa `returnToStep` undan oldingi pog'ona; `RETURN` yo'q bo'lsa `returnToStep` yuborilmaydi; lavozimlar shu tashkilotniki.
- Tavsiya: pog'onalarni tartiblanadigan ro'yxat sifatida qiling, `allowedActions` — checkbox'lar, `returnToStep` — `RETURN` belgilanganda chiqadigan select.

### 8.5. Jarayon ishtirokchilari — `/api/v1/process-participants`

| Metod  | URL                | Tana / javob                                                                   |
| ------ | ------------------ | ------------------------------------------------------------------------------ |
| `POST` | `/`                | `{ "processType": "CADASTRE_PASSPORT_REVIEW", "slot": "FVV", "orgId": "..." }` |
| `GET`  | `/`                | `[{ id, processType, slot, orgId, orgName, isActive }]`                        |
| `PUT`  | `/{id}/deactivate` | —                                                                              |

- `slot` qiymatlari: `FVV`, `SES`.
- Tashkilot uchun **avval** faol pog'onalar (§8.4) yaratilgan bo'lishi shart.

### 8.6. Birinchi sozlash tartibi (FVV va SES)

1. `partner-orgs`: FVV (TIN 201862006) va SES (TIN 200794614).
2. `org-positions`: FVV → EXECUTOR, DEPUTY, HEAD; SES → EXECUTOR, HEAD.
3. `org-employees`: har bir lavozimga xodim(lar).
4. `workflow-definitions`:
   - FVV: 1 EXECUTOR `[FILL_DATA, SUBMIT, REJECT]` · 2 DEPUTY `[ENDORSE, RETURN→1]` · 3 HEAD `[SIGN]`;
   - SES: 1 EXECUTOR `[FILL_DATA, SUBMIT, REJECT]` · 2 HEAD `[SIGN, RETURN→1]`.
5. `process-participants`: `FVV` slot → FVV, `SES` slot → SES.

Bu sozlanmaguncha customer tasdiqlashi `400` qaytaradi: "Ushbu jarayon uchun ishtirokchi tashkilotlar belgilanmagan".

---

## 9. Enum'lar ma'lumotnomasi

| Enum                                                             | Qiymatlar                                                    | Qayerda                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `CadastrePassportStatus`                                         | `NEW`, `IN_REVIEW`, `IN_COMMITTEE`, `APPROVED`, `REJECTED`   | `status`                                                  |
| `CadastrePassportReviewParty` _(oldin `ReviewOrganizationType`)_ | `CUSTOMER`, `FVV`, `SES`, `COMMITTEE`                        | `reviews[].party`                                         |
| `SignAction`                                                     | `APPROVED`, `REJECTED`                                       | `reviews[].signAction`, `customer-sign`, `committee-sign` |
| `CadastreDataStatus`                                             | `ACTIVE`, `INACTIVE`                                         | `preparerData.status`                                     |
| `FireExplosionCategory`                                          | `A`, `B`, `V`, `G`, `D`                                      | `fvvData.fireExplosionCategory`                           |
| `FireResistanceClass`                                            | `I`, `II`, `III`, `IV`                                       | `fvvData.fireResistanceClass`                             |
| `ProcessType`                                                    | `CADASTRE_PASSPORT_REVIEW`                                   | `workflows[].processType`, admin                          |
| `WorkflowInstanceStatus`                                         | `IN_PROGRESS`, `COMPLETED`, `REJECTED`, `CANCELLED`          | `workflows[].status`                                      |
| `WorkflowAction`                                                 | `FILL_DATA`, `SUBMIT`, `ENDORSE`, `RETURN`, `REJECT`, `SIGN` | `workflows[].allowedActions`, `history[].action`, admin   |

**Frontdagi tavsiya etilgan yorliqlar** (backend enum nomini yuboradi, yorliqni front beradi):

| Qiymat      | Tugma yorlig'i          | Tarixdagi yorliq            |
| ----------- | ----------------------- | --------------------------- |
| `FILL_DATA` | Saqlash                 | Ma'lumot kiritildi          |
| `SUBMIT`    | Xulosa bilan yuborish   | Keyingi pog'onaga yuborildi |
| `ENDORSE`   | Kelishish               | Kelishildi (viza)           |
| `RETURN`    | Qaytarish               | Qaytarildi                  |
| `REJECT`    | Rad etish               | Rad etildi                  |
| `SIGN`      | E-imzo bilan tasdiqlash | E-imzo bilan tasdiqlandi    |

| Qiymat                                                 | Yorliq                                              |
| ------------------------------------------------------ | --------------------------------------------------- |
| `IN_PROGRESS` / `COMPLETED` / `REJECTED` / `CANCELLED` | Jarayonda / Yakunlandi / Rad etildi / Bekor qilindi |
| `CUSTOMER` / `FVV` / `SES` / `COMMITTEE`               | Buyurtmachi / FVV / SES / Qo'mita                   |

---

## 10. Xatolar va HTTP kodlar

Javob formati o'zgarmagan: `{ "success": false, "message": "...", "errors": { ... } }`.

| Kod   | Qachon                                                                                                          | `message`                                                                            |
| ----- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `400` | Validatsiya xatosi                                                                                              | "Kerakli qatorlar to'ldirilmadi" + `errors` (masalan `preparerData.address`)         |
| `400` | Biznes qoidasi buzilgan (status noto'g'ri, sabab yozilmagan, bo'lim to'ldirilmagan va h.k.)                     | Aniq sabab matni — foydalanuvchiga **o'zicha ko'rsatish mumkin**                     |
| `403` | Rol yoki huquq yo'q: boshqa tashkilot pasporti, preparer/customer emas, xodim lavozimi joriy pog'onaga mos emas | "Bunday amaliyot uchun sizga ruxsat berilmagan" (umumiy matn)                        |
| `404` | Pasport / parent topilmadi                                                                                      | "... topilmadi"                                                                      |
| `500` | Bir vaqtda ikki xodim bir ishni o'zgartirsa (optimistik qulf)                                                   | Tavsiya: "Ma'lumot boshqa foydalanuvchi tomonidan o'zgartirildi, sahifani yangilang" |

**Tez-tez uchraydigan biznes xatolari (`400`):**

| Vaziyat                                          | Matn                                                          |
| ------------------------------------------------ | ------------------------------------------------------------- |
| Customer rad etdi, sabab yo'q                    | "Rad etish sababi yozilmadi"                                  |
| Ijrochi bo'limni to'ldirmay yubordi              | "Avval o'z bo'limingizdagi kadastr ma'lumotlarini to'ldiring" |
| FVV xodimi SES formasini yubordi (yoki aksincha) | "Ushbu ma'lumotlar faqat FVV tashkiloti tomonidan kiritiladi" |
| Joriy pog'onada amal ruxsat etilmagan            | "Joriy pog'onada '...' amali ruxsat etilmagan"                |
| Boshqa ijrochi olgan ishni o'zgartirmoqchi       | "Ushbu ish boshqa ijrochi xodimga biriktirilgan"              |
| RETURN/REJECT sababsiz                           | "Sabab kiritilishi shart"                                     |
| Tashkilot jarayoni tugagan                       | "Tashkilotingiz kesimidagi jarayon holati: ..."               |
| Pasport `IN_REVIEW` emas                         | "Status 'Tashkilot tomonidan ko'rib chiqish'da emas"          |

> `myTurn` va `allowedActions` bo'yicha tugmalar to'g'ri ko'rsatilsa, bu xatolar faqat parallel harakatlarda (boshqa xodim sahifa yangilanmaguncha amal bajarib qo'ygan bo'lsa) chiqadi.

---

## 11. Migratsiya checklist

### Umumiy

- [ ] Barcha `{cPassportId}` o'zgaruvchilarini `{id}` ga moslash (URL shakli bir xil).
- [ ] `committee-sign` javobini `ApiResponse` sifatida parse qilish.
- [ ] 403 uchun "ruxsat yo'q" holatini batafsil sahifada to'g'ri ko'rsatish.
- [ ] Login'dan keyin `GET /api/v1/org-employees/me` ni chaqirib, natijani saqlash.

### Preparer (LEGAL)

- [ ] Create formasi: 24 ta maydonni `preparerData` ichiga o'rash.
- [ ] Validatsiya xatolari kalitlarini `preparerData.*` ga moslash.
- [ ] Tahrirlash/o'chirish tugmalari: faqat `status === NEW` va `preparerProfileId === me.profileId`.
- [ ] Qayta yuborish tugmasi: faqat `REJECTED` va preparer.

### Customer (LEGAL)

- [ ] Imzo/rad etish tugmalari: faqat `status === NEW` va `customerProfileId === me.profileId`.
- [ ] Rad etishda "sabab" maydonini majburiy qilish.

### SES / FVV LEGAL kabineti

- [ ] `fvv-sign` / `ses-sign` chaqiruvlari va tugmalarini **olib tashlash**.
- [ ] `fvv-cadastre-data` / `ses-cadastre-data` tahrirlash formalarini LEGAL kabinetdan **olib tashlash**.
- [ ] Faqat ko'rish: ro'yxat, batafsil, PDF preview, `workflows[]` progress, tarix.

### SES / FVV xodimi (INDIVIDUAL) — yangi

- [ ] `org-employees/me` → `data !== null` bo'lsa menyuga "Mening ishlarim" (`my-tasks`).
- [ ] Ro'yxatda `myTurn === true` uchun "Sizning navbatingiz" badge'i.
- [ ] Batafsil sahifa: `workflows.find(w => w.myTurn)` va uning `allowedActions` bo'yicha tugmalar (§6.4) — lavozim/pog'ona **hardcode qilinmaydi**.
- [ ] `FILL_DATA`: `slot` ga qarab FVV yoki SES formasi (`PUT /workflow/fvv-data` / `ses-data`), forma to'liq yuboriladi.
- [ ] `SUBMIT`: "Xulosa bilan yuborish" modal'i (`conclusion` + fayl yuklash).
- [ ] `REJECT` / `RETURN`: sabab modal'i; `RETURN` da `returnToStep` bo'yicha izoh.
- [ ] `ENDORSE`: "Kelishish" tugmasi.
- [ ] `SIGN`: ijrochi xulosasini (tarixdagi oxirgi `SUBMIT`) va PDF'ni ko'rsatish, e-imzo → `{ sign }`.
- [ ] Har bir amaldan keyin `GET /{id}` ni qayta yuklash.
- [ ] Tashkilot tarixi timeline'i (`history`).

### Batafsil sahifa (hamma uchun)

- [ ] Yassi preparer maydonlari → `cadastreData.preparerData.*`.
- [ ] Yangi `fvvData` va `sesData` bloklari (`null` → "to'ldirilmagan").
- [ ] Review'lar: `organizationType` → `party`, `reviewerName`, `createdAt`.
- [ ] Tashkilotlar progressi kartalari (`workflows[]`: `orgName`, `currentStep/totalSteps`, `currentPositionName`, `status`).
- [ ] `parentCadastrePassportId` bo'lsa — "Oldin yuborilgan pasportni ko'rish" havolasi.

### Qo'mita (MANAGER)

- [ ] Imzo tugmasi sharti: `role === MANAGER` **va** `directions.includes('CADASTRE_PASSPORT')` va `status === IN_COMMITTEE`.

### Admin panel — yangi

- [ ] Hamkor tashkilotlar.
- [ ] Lavozimlar (tashkilot bo'yicha).
- [ ] Xodimlar (PINFL + tug'ilgan sana, filtrlar, deaktivatsiya).
- [ ] Jarayon pog'onalari (versiyalar ro'yxati, yangi versiya yaratish formasi).
- [ ] Jarayon ishtirokchilari.
