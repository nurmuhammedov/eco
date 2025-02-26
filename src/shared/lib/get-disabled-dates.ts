export function getDisabledDates(
  date: Date,
  direction: 'after' | 'before',
  referenceDate: Date = new Date(),
): boolean {
  if (!(date instanceof Date) || isNaN(date.getTime())) return true;

  const minDate = new Date('1900-01-01'); // Har doim minimal sana
  if (date < minDate) return true;

  return direction === 'before' ? date < referenceDate : date > referenceDate;
}
