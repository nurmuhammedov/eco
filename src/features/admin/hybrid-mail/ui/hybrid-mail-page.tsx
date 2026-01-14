import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Switch } from '@/shared/components/ui/switch'
import { Mail } from 'lucide-react'
import { useGetHybridMailStatus, useUpdateHybridMailStatus } from '../api/queries'

const HybridMailPage = () => {
  const { data, isLoading } = useGetHybridMailStatus()
  const { mutate, isPending } = useUpdateHybridMailStatus()

  const handleToggle = (checked: boolean) => {
    mutate({ status: checked })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gibrid pochta sozlamalari</h1>
        <p className="text-muted-foreground">Tizim orqali yuboriladigan xabarlarni boshqarish</p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Mail className="text-primary h-5 w-5" />
              Gibrid pochta xizmati
            </CardTitle>
            <CardDescription>
              Ushbu funksiya yoqilganda barcha xabarnomalar gibrid pochta orqali yuboriladi.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Holati</label>
              <p className="text-sm text-neutral-500">{data?.status ? 'Xizmat yoqilgan' : 'Xizmat o‘chirilgan'}</p>
            </div>
            <Switch
              checked={data?.status || false}
              onChange={(e) => handleToggle(e.target.checked)}
              disabled={isLoading || isPending}
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HybridMailPage
