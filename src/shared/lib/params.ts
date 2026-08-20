import { ISearchParams } from '@/shared/types'

/**
 * Only converts values that survive a round trip through `Number`. This keeps
 * identifiers with leading zeros and values longer than a safe integer intact,
 * and stops an empty parameter from turning into `0`.
 */
function _toNumberIfLossless(value: string): number | null {
  if (value === '' || !/^-?\d+(\.\d+)?$/.test(value)) return null

  const parsed = Number(value)

  return Number.isFinite(parsed) && String(parsed) === value ? parsed : null
}

function _correctParamsDataType(paramsObj: Record<string, string>): ISearchParams {
  const result: ISearchParams = {}

  for (const [key, rawValue] of Object.entries(paramsObj)) {
    const value = rawValue.trim()
    const asNumber = _toNumberIfLossless(value)

    if (asNumber !== null) {
      result[key] = asNumber
      continue
    }

    const lowered = value.toLowerCase()

    if (lowered === 'true' || lowered === 'false') {
      result[key] = lowered === 'true'
      continue
    }

    result[key] = value
  }

  return result
}

function convertParamsToObject(params: URLSearchParams): ISearchParams {
  return _correctParamsDataType(Object.fromEntries(params))
}

export { convertParamsToObject }
