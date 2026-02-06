export function formatPhoneNumber(
  phoneNumber: string | undefined | null,
  formatType: 'default' | 'readable' | 'groups' | 'pretty' | 'dashed' = 'groups'
): string {
  if (!phoneNumber) {
    return ''
  }

  const cleaned = phoneNumber.replace(/\D/g, '')

  if (cleaned.length < 12) {
    return phoneNumber
  }

  const isUzbekNumber = cleaned.startsWith('998')

  if (!isUzbekNumber) {
    return phoneNumber
  }

  const countryCode = cleaned.slice(0, 3)
  const operatorCode = cleaned.slice(3, 5)
  const group1 = cleaned.slice(5, 8)
  const group2 = cleaned.slice(8, 10)
  const group3 = cleaned.slice(10, 12)

  switch (formatType) {
    case 'readable':
      return `+${countryCode} ${operatorCode} ${group1} ${group2} ${group3}`

    case 'groups':
      return `+${countryCode} (${operatorCode}) ${group1}-${group2}-${group3}`

    case 'pretty':
      return `+${countryCode} ${operatorCode} ${group1}-${group2}-${group3}`

    case 'dashed':
      return `+${countryCode}-${operatorCode}-${group1}-${group2}-${group3}`

    case 'default':
    default:
      return `+${countryCode}${operatorCode}${group1}${group2}${group3}`
  }
}
