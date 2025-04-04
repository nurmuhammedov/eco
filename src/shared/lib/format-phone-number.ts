export function formatPhoneNumber(
  phoneNumber: string | undefined | null,
  formatType:
    | 'default'
    | 'readable'
    | 'groups'
    | 'pretty'
    | 'dashed' = 'groups',
): string {
  // Agar telefon raqami mavjud bo'lmasa, bo'sh string qaytarish
  if (!phoneNumber) {
    return '';
  }

  // Faqat raqamlarni olib qolib, qolgan belgilarni o'chirish
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Agar raqam uzunligi 12 dan kam bo'lsa, original raqamni qaytarish
  if (cleaned.length < 12) {
    return phoneNumber;
  }

  // O'zbek raqami formatida bo'lishini tekshirish (998 bilan boshlanishi)
  const isUzbekNumber = cleaned.startsWith('998');

  if (!isUzbekNumber) {
    return phoneNumber;
  }

  // Raqam qismlarini ajratish
  const countryCode = cleaned.slice(0, 3); // 998
  const operatorCode = cleaned.slice(3, 5); // Operator kodi: 9X(XX)/XX
  const group1 = cleaned.slice(5, 8); // Birinchi guruh: XXX
  const group2 = cleaned.slice(8, 10); // Ikkinchi guruh: XX
  const group3 = cleaned.slice(10, 12); // Uchinchi guruh: XX

  // Formatni tanlash va tegishli formatda qaytarish
  switch (formatType) {
    case 'readable':
      return `+${countryCode} ${operatorCode} ${group1} ${group2} ${group3}`;

    case 'groups':
      return `+${countryCode} (${operatorCode}) ${group1}-${group2}-${group3}`;

    case 'pretty':
      return `+${countryCode} ${operatorCode} ${group1}-${group2}-${group3}`;

    case 'dashed':
      return `+${countryCode}-${operatorCode}-${group1}-${group2}-${group3}`;

    case 'default':
    default:
      return `+${countryCode}${operatorCode}${group1}${group2}${group3}`;
  }
}
