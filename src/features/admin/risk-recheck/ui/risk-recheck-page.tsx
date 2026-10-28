import { useMutation } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'

/**
 * The recheck runs in the background and nothing reports when it ends, so the
 * page only starts it and says where the result will show up.
 */
const RiskRecheckPage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => (await apiClient.post<{ message?: string }>('/risk-analyses/recheck')).data,
    onSuccess: (response) => {
      toast.info(response?.message || 'Qayta havf tahlili jarayoni boshlandi', { richColors: true })
    },
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Havf tahlili</h1>
        <p className="text-muted-foreground">Choraklik xavf tahlili natijalarini qayta o‘tkazish</p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <RefreshCw className="text-primary h-5 w-5" />
            Havf tahlilini qayta o‘tkazish
          </CardTitle>
          <CardDescription>
            Oxirgi chorak davridagi yuqori (HIGH) darajali havf tahlillari qayta hisoblanadi. Natijasi yana yuqori
            bo‘lgan obyektlar uchun tekshiruv yaratiladi (davlat korxonalaridan tashqari). Jarayon fon rejimida
            bajariladi: natijani bir necha daqiqadan so‘ng havf tahlili ro‘yxati va detalkasida ko‘rish mumkin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button loading={isPending}>Havf tahlilini qayta o‘tkazish</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Qayta havf tahlili</AlertDialogTitle>
                <AlertDialogDescription>
                  Oxirgi chorak davridagi barcha yuqori (HIGH) darajali havf tahlillari qayta o‘tkaziladi. Natijasi yana
                  yuqori bo‘lgan obyektlar uchun tekshiruv yaratiladi. Davom etasizmi?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction onClick={() => mutate()}>Davom etish</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default RiskRecheckPage
