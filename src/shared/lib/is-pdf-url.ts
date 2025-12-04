export function isPDFUrl(url: string): boolean {
  return url?.toLowerCase().endsWith('.pdf') || false
}
