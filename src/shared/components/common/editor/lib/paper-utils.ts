// src/features/editor/utils/paperUtils.ts

/**
 * Qog'oz o'lchamlari bilan ishlash uchun utillar.
 * Bu fayl A4 va boshqa standart qog'oz o'lchamlari bilan ishlash uchun kerakli
 * konstantalar va funksiyalarni o'z ichiga oladi.
 */

/**
 * Millimetrlarni pikselga aylantirish uchun koeffitsient (96dpi ekran uchun)
 * Taxminiy hisob (1mm = 3.78px 96dpi ekranda)
 */
export const MM_TO_PX_RATIO = 3.78

/**
 * Millimetrni pikselga aylantirish
 * @param mm - millimetr qiymati
 * @returns piksel qiymati (butun son)
 */
export const mmToPx = (mm: number): number => Math.round(mm * MM_TO_PX_RATIO)

/**
 * Standart qog'oz o'lchamlari millimetrlarda
 */
export const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
}

/**
 * Qog'oz o'lchamlari va orientatsiyasiga ko'ra kontentning o'lchamlarini hisoblaydi
 * @param paperSize - qog'oz o'lchami (a4, letter, va hkz)
 * @param orientation - orientatsiya (portrait yoki landscape)
 * @param marginMm - marjin millimetrlarda
 * @returns o'lchamlar millimetr va pikselda
 */
export const getContentDimensions = (
  paperSize: string,
  orientation: 'portrait' | 'landscape',
  marginMm: number
): { widthMm: number; heightMm: number; widthPx: number; heightPx: number } => {
  // Get base dimensions from paper size
  let width = PAPER_SIZES.a4.width // default to A4
  let height = PAPER_SIZES.a4.height

  if (PAPER_SIZES[paperSize]) {
    width = PAPER_SIZES[paperSize].width
    height = PAPER_SIZES[paperSize].height
  }

  // Swap dimensions for landscape
  if (orientation === 'landscape') {
    ;[width, height] = [height, width]
  }

  // Calculate content dimensions (removing margins)
  const contentWidthMm = width - marginMm * 2
  const contentHeightMm = height - marginMm * 2

  return {
    widthMm: contentWidthMm,
    heightMm: contentHeightMm,
    widthPx: mmToPx(contentWidthMm),
    heightPx: mmToPx(contentHeightMm),
  }
}
