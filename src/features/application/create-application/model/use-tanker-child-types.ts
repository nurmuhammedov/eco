import { useChildEquipmentTypes } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useMemo } from 'react'

/** A TANKER sub type as `/child-equipments/select` gives it: it carries its kind as well */
interface TankerSubType {
  id: number
  name: string
  childType?: string | null
}

/**
 * The kinds of tanker to pick from. A tanker application names the kind
 * (`childType`) rather than the sub type id, so the options carry the kind; the
 * sub type id is kept to find the kind of a registered tanker, whose record
 * holds the id only.
 */
export const useTankerChildTypes = () => {
  const { data } = useChildEquipmentTypes('TANKER')

  const childTypes = useMemo(
    () =>
      ((data ?? []) as TankerSubType[])
        .filter((item) => !!item.childType)
        .map((item) => ({ id: String(item.childType), name: item.name, subTypeId: item.id })),
    [data]
  )

  const childTypeOptions = useMemo(
    () => getSelectOptions(childTypes.map(({ id, name }) => ({ id, name }))),
    [childTypes]
  )

  /** The kind of the sub type a registered tanker points at */
  const childTypeOf = (subTypeId?: number | string | null) =>
    childTypes.find((item) => String(item.subTypeId) === String(subTypeId))?.id ?? ''

  return { childTypes, childTypeOptions, childTypeOf }
}
