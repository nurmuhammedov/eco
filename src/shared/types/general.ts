/** A select entry as the dictionaries send it; the extras come with some of them */
export type OptionItem<T> = {
  id: T
  name: string
  type?: string | null
  registryNumber?: string | null
}
