export function truncateString(value: string | null | undefined, maxLength: number = 50): string {
  if (!value) return '?';

  return value.length <= maxLength ? value : value.slice(0, maxLength) + '…';
}
