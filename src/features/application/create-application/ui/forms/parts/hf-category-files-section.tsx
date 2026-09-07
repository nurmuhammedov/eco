import { useEffect, useMemo, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useHazardousFacilityCategoryDictionarySelect } from '@/shared/api/dictionaries'
import { emptyHfAppealFiles } from '@/entities/create-application/schemas/hf-appeal-files'
import { HfAppealFilesFields } from './hf-appeal-files-fields'

export const HF_CATEGORY_MODE = { SINGLE: 'SINGLE', MULTI: 'MULTI' } as const

const hasAnyFile = (set: unknown) =>
  !!set &&
  Object.values(set as Record<string, unknown>).some((value) => value !== undefined && value !== null && value !== '')

interface HfCategoryFilesSectionProps {
  form: UseFormReturn<any>
  requireMandatory?: boolean
  /**
   * A record filed before the categories existed carries its attachments with
   * no category to hang them on. They belong to whichever single sector is
   * picked, rather than being lost.
   */
  unassignedFiles?: Record<string, unknown> | null
}

/**
 * The facility declares either one sector or several. Each chosen category
 * brings its own attachment set, which the server takes as a map keyed by
 * category id - single or multiple, the shape is the same.
 */
export const HfCategoryFilesSection = ({
  form,
  requireMandatory = true,
  unassignedFiles,
}: HfCategoryFilesSectionProps) => {
  const mode = form.watch('categoryMode')
  const isMulti = mode === HF_CATEGORY_MODE.MULTI

  const categoryId = form.watch('categoryId')
  const multiCategoryIds = form.watch('multiCategoryIds')

  const { data: categories = [] } = useHazardousFacilityCategoryDictionarySelect(isMulti)

  const selectedIds = useMemo(() => {
    if (!isMulti) return categoryId ? [String(categoryId)] : []

    return ((multiCategoryIds || []) as (string | number)[]).map(String)
  }, [isMulti, multiCategoryIds, categoryId])

  const nameById = useMemo(
    () => new Map((categories as any[]).map((item) => [String(item.id), item.name as string])),
    [categories]
  )

  /**
   * Attachments belong to the categories currently chosen. Dropping a category
   * has to drop its set too, or the appeal carries files for a sector it no
   * longer declares - which the server rejects.
   *
   * The set cannot be seeded by "no key yet": mounting the file fields registers
   * the whole path first, so by the time this runs the category always has an
   * empty set waiting. What decides is whether anything is actually in it, and
   * a category inherits at most once - otherwise clearing a file by hand would
   * bring it straight back.
   */
  const seeded = useRef(new Set<string>())

  useEffect(() => {
    const current = form.getValues('hfAppealFilesDto') || {}

    // Only one sector can inherit the loose set; several would each claim the same files.
    const inherited = isMulti ? undefined : unassignedFiles

    const next: Record<string, unknown> = {}
    let changed = Object.keys(current).length !== selectedIds.length

    for (const id of selectedIds) {
      const existing = current[id]
      const canInherit = !!inherited && !seeded.current.has(id) && !hasAnyFile(existing)

      if (canInherit) {
        seeded.current.add(id)
        next[id] = inherited
        changed = true
      } else {
        next[id] = existing ?? emptyHfAppealFiles()
      }
    }

    if (changed) form.setValue('hfAppealFilesDto', next, { shouldValidate: false })
  }, [selectedIds, isMulti, unassignedFiles, form])

  return (
    <>
      <FormField
        control={form.control}
        name="categoryMode"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel required>Tarmoqlar soni</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  // The two modes read from different lists, so a value carried
                  // across could be one this mode never offered.
                  form.setValue('categoryId', undefined, { shouldValidate: false })
                  form.setValue('multiCategoryIds', [], { shouldValidate: false })
                }}
                className="flex flex-col gap-2 sm:flex-row sm:gap-6"
              >
                <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                  <FormControl>
                    <RadioGroupItem value={HF_CATEGORY_MODE.SINGLE} />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer font-normal">Bir tarmoqli</FormLabel>
                </FormItem>
                <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                  <FormControl>
                    <RadioGroupItem value={HF_CATEGORY_MODE.MULTI} />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer font-normal">Ko‘p tarmoqli</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isMulti ? (
        <FormField
          control={form.control}
          name="multiCategoryIds"
          render={({ field }) => (
            <FormItem className="mb-4 flex flex-col">
              <FormLabel required>XICHO toifalari</FormLabel>
              <FormControl>
                <MultiSelect
                  className="3xl:w-sm w-full"
                  value={field.value || []}
                  onChange={field.onChange}
                  options={categories}
                  maxDisplayItems={5}
                  placeholder="Kamida ikkita toifa tanlang"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel required>XICHO toifasi</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ''}>
                  <SelectTrigger className="3xl:w-sm w-full">
                    <SelectValue placeholder="XICHO toifasini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories as any[]).map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Open sections rather than accordions: every attachment is needed to
          finish the appeal, so nothing gains from being folded away. */}
      {selectedIds.map((id, index) => (
        <section key={id} className={index > 0 ? 'mt-8' : 'mt-2'}>
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="text-base font-semibold text-neutral-900">{nameById.get(id) || 'Toifa'}</h3>
            {selectedIds.length > 1 && (
              <span className="text-xs text-neutral-500">
                {index + 1} / {selectedIds.length}
              </span>
            )}
          </div>

          <HfAppealFilesFields form={form} prefix={`hfAppealFilesDto.${id}.`} requireMandatory={requireMandatory} />
        </section>
      ))}
    </>
  )
}
