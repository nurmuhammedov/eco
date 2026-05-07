import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, FileText } from 'lucide-react'
import { useDetail } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'

export const NewsDetail: FC = () => {
  const { id } = useParams<{ id: string }>()

  const { data: news, isLoading } = useDetail<any>('/announcements/', id)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <Skeleton className="mb-6 h-10 w-3/4" />
          <div className="mb-8 flex items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <FileText className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Xabarnoma topilmadi</h3>
        <p className="mt-2 text-gray-500">Qidirayotgan xabarnomangiz o'chirilgan yoki mavjud emas.</p>
        <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
          Orqaga qaytish
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <GoBack title="Xabarnoma tafsilotlari" fallbackPath="/news" />
      </div>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1.5 w-full bg-blue-600" />

        <div className="p-6 md:p-8">
          <header className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                <Calendar className="h-4 w-4" />
                <span>{getDate(news.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(news.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{news.title}</h1>
          </header>

          <div
            className="prose prose-blue max-w-none text-gray-800"
            style={{ fontFamily: "'Golos Text', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>
    </div>
  )
}
