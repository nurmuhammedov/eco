export function getInitials(input: unknown, maxLength = 1, fallback = '?'): string {
  // Kiritilgan qiymatni tekshirish
  if (input === null || input === undefined) {
    return fallback;
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const str = String(input).trim();
  if (!str) {
    return fallback;
  }

  try {
    // Matnni bo'shliqlar bo'yicha ajratish
    const parts = str.split(/\s+/).filter(Boolean);

    // Agar bo'sh qatorlar qaytsa
    if (!parts.length) {
      return str.charAt(0).toUpperCase() || fallback;
    }

    // Birinchi N qismlardan bosh harflarni olish
    const initials = parts
      .slice(0, maxLength)
      .map((part) => {
        // Unicode belgilarni hisobga olish (o', g', sh kabi)
        const firstChar = Array.from(part)[0] || '';
        return firstChar.toUpperCase();
      })
      .join('');

    return initials || fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
