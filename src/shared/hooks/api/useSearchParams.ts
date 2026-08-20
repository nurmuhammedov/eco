import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cleanParams, convertParamsToObject, isObject } from '@/shared/lib'
import { ISearchParams } from '@/shared/types'

const toSearchParamsInit = (params: ISearchParams): Record<string, string> => {
  const init: Record<string, string> = {}

  for (const [key, value] of Object.entries(cleanParams(params))) {
    init[key] = String(value)
  }

  return init
}

function useCustomSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsString = searchParams.toString()

  // Rebuilding this every render would invalidate every dependency array that reads it.
  const paramsObject = useMemo<ISearchParams>(
    () => convertParamsToObject(new URLSearchParams(paramsString)),
    [paramsString]
  )

  /**
   * Updates are computed from the previous params rather than from a captured
   * render, so two calls in the same tick cannot overwrite each other.
   */
  const addParams = useCallback(
    (paramKeyOrObj: ISearchParams, ...removeKeys: string[]): void => {
      if (!paramKeyOrObj) return

      setSearchParams(
        (previous) => {
          const next = convertParamsToObject(previous)

          removeKeys.forEach((key) => delete next[key])

          return toSearchParamsInit(isObject(paramKeyOrObj) ? { ...next, ...paramKeyOrObj } : next)
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const removeParams = useCallback(
    (...paramKeys: string[]): void => {
      setSearchParams(
        (previous) => {
          const next = convertParamsToObject(previous)

          paramKeys.forEach((key) => delete next[key])

          return toSearchParamsInit(next)
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return { paramsObject, paramsString, addParams, removeParams }
}

export default useCustomSearchParams
