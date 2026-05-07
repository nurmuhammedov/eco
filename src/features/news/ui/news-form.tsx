import { FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Save } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import TinyMCEEditor from '@/shared/components/common/editor/ui/tinymce-editor'
import { useDetail, useAdd, useUpdate } from '@/shared/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { GoBack } from '@/shared/components/common'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const newsSchema = z.object({
  title: z.string().trim().min(1, 'Majburiy maydon!'),
  content: z.string().min(1, 'Majburiy maydon!'),
  isActive: z.boolean(),
})

type NewsFormValues = z.infer<typeof newsSchema>

export const NewsForm: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const { control, handleSubmit, reset } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      content: '',
      isActive: true,
    },
  })

  const { data: newsDetail, isLoading: isDetailLoading } = useDetail<any>('/announcements/', id, isEdit)

  const { mutate: addNews } = useAdd<NewsFormValues, any, any>('/announcements', 'Xabarnoma muvaffaqiyatli qoʻshildi')

  const { mutate: updateNews } = useUpdate<NewsFormValues, any, any>(
    '/announcements/',
    id,
    'put',
    'Xabarnoma muvaffaqiyatli tahrirlandi'
  )

  useEffect(() => {
    if (newsDetail) {
      reset({
        title: newsDetail.title,
        content: newsDetail.content,
        isActive: newsDetail.isActive ?? true,
      })
    }
  }, [newsDetail, reset])

  const onSubmit = (values: NewsFormValues) => {
    if (isEdit) {
      updateNews(values, {
        onSuccess: () => navigate(-1),
      })
    } else {
      addNews(values, {
        onSuccess: () => navigate(-1),
      })
    }
  }

  if (isEdit && isDetailLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-[910px] w-full rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 pb-5">
      <div className="flex items-center justify-between">
        <GoBack title={isEdit ? 'Xabarnomani tahrirlash' : 'Yangi xabarnoma qoʻshish'} fallbackPath="/news" />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-end gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="title">Sarlavha</Label>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} id="title" placeholder="Kiriting" />
                  {fieldState.error && <span className="text-sm text-red-500">{fieldState.error.message}</span>}
                </>
              )}
            />
          </div>

          {isEdit && (
            <div className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 shadow-sm">
              <Label htmlFor="isActive" className="cursor-pointer text-sm font-medium text-gray-700">
                Aktiv
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch id="isActive" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            name="content"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <TinyMCEEditor
                  value={field.value}
                  onChange={(content) => field.onChange(content)}
                  height={910}
                  isPageLayout={false}
                />
                {fieldState.error && <span className="text-sm text-red-500">{fieldState.error.message}</span>}
              </>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-10">
            <Save className="mr-2 h-5 w-5" />
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  )
}
