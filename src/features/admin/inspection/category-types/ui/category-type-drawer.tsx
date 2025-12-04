import { Fragment, useMemo } from 'react'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useUIActionLabel } from '@/shared/hooks'
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import { useCategoryTypeDrawer } from '@/shared/hooks/entity-hooks'
import { useCategoryTypeForm } from '../model/use-category-type-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { UIModeEnum } from '@/shared/types'
import { CategoryTypeView } from '@/features/admin/inspection/category-types/ui/category-type-view'
import { inspectionCategoryOptions } from '@/entities/admin/inspection/shared/static-options/inspection-category-options'

export const CategoryTypeDrawer = () => {
  const { isOpen, onClose, mode, isCreate } = useCategoryTypeDrawer()
  const modeLabel = useUIActionLabel(mode)
  const { form, onSubmit, isPending, isFetching, categoryTypeData } = useCategoryTypeForm()
  const options = useMemo(() => getSelectOptions(inspectionCategoryOptions), [inspectionCategoryOptions])

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      title={modeLabel}
      loading={isPending}
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {mode === UIModeEnum.VIEW ? (
        <CategoryTypeView data={categoryTypeData as any} />
      ) : (
        <Form {...form}>
          <div className="space-y-4">
            {isFetching && !isCreate ? (
              <FormSkeleton length={2} />
            ) : (
              <Fragment>
                <FormField
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategoriya</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value)
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>{options}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tekshiruv turi</FormLabel>
                      <FormControl>
                        <Input placeholder="Tekshiruv turini kiriting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Fragment>
            )}
          </div>
        </Form>
      )}
    </BaseDrawer>
  )
}
