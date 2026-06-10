import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCadastreMock } from '../model/use-cadastre-mock'
import { useAuth } from '@/shared/hooks/use-auth'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Search } from 'lucide-react'
import GoBack from '@/shared/components/common/go-back'
import DetailRow from '@/shared/components/common/detail-row'
import { toast } from 'sonner'
import useData from '@/shared/hooks/api/useData'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'

const schema = z.object({
  attributeFile: z.string().min(1, 'Fayl yuklash majburiy'),
  passportFile: z.string().min(1, 'Fayl yuklash majburiy'),
})

type FormValues = z.infer<typeof schema>

export default function CadastreAdd() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { create } = useCadastreMock()

  const [stir, setStir] = useState('')
  const [searchedStir, setSearchedStir] = useState<string | null>(null)

  const {
    data: legalInfo,
    isFetching: isLegalInfoLoading,
    isError: isLegalInfoError,
  } = useData<any>(`/users/legal/${searchedStir}`, !!searchedStir && searchedStir.length === 9)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      attributeFile: '',
      passportFile: '',
    },
  })

  const handleSearch = () => {
    if (stir.length === 9) {
      setSearchedStir(stir)
    } else {
      toast.warning('STIR 9 ta raqamdan iborat bo‘lishi kerak.')
    }
  }

  const handleClearSearch = () => {
    setStir('')
    setSearchedStir(null)
    form.reset()
  }

  const onSubmit = (data: FormValues) => {
    create({
      creatorOrgName: user?.name || 'Mening tashkilotim',
      creatorOrgStir: String(user?.tinOrPin || ''),
      targetOrgName: legalInfo?.name || 'Topilgan tashkilot',
      targetOrgStir: searchedStir || '',
      attributeFile: data.attributeFile,
      passportFile: data.passportFile,
      titleFile: '/files/registry-files/2025/july/22/1753177653262.pdf', // Mocked automatically
    })

    toast.success('So‘rov yuborildi')
    navigate('/cadastre-passport')
  }

  const hasLegalInfo = !!legalInfo && !isLegalInfoError

  return (
    <div className="space-y-4">
      <GoBack title="TXYZ kadastr qo'shish" />

      <Card>
        <CardHeader>
          <CardTitle>Tashkilotni qidirish</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Input
              placeholder="Tashkilot STIRini kiriting..."
              value={stir}
              onChange={(e) => setStir(e.target.value)}
              disabled={hasLegalInfo || isLegalInfoLoading}
              maxLength={9}
            />
            {hasLegalInfo ? (
              <Button variant="destructive" onClick={handleClearSearch} className="w-40">
                O‘chirish
              </Button>
            ) : (
              <Button
                onClick={handleSearch}
                disabled={isLegalInfoLoading}
                className="w-40"
                loading={isLegalInfoLoading}
              >
                <Search className="mr-2 h-4 w-4" /> Qidirish
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {hasLegalInfo && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Tashkilot maʼlumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
                <DetailRow title="Tashkilot nomi:" value={legalInfo?.name || '-'} />
                <DetailRow title="Tashkilot rahbari F.I.Sh.:" value={legalInfo?.directorName || '-'} />
                <DetailRow title="Manzil:" value={legalInfo?.address || '-'} />
                <DetailRow title="Telefon raqami:" value={legalInfo?.phoneNumber || '-'} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kerakli hujjatlarni yuklash</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id="cadastre-add-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="attributeFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Atribut fayli</FormLabel>
                          <FormControl>
                            <InputFile
                              name={field.name as 'attributeFile'}
                              form={form}
                              uploadEndpoint="/attachments/accidents"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passportFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Kadastr passport fayli</FormLabel>
                          <FormControl>
                            <InputFile
                              name={field.name as 'passportFile'}
                              form={form}
                              uploadEndpoint="/attachments/accidents"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline" onClick={() => navigate('/cadastre-passport')}>
                Bekor qilish
              </Button>
              <Button type="submit" form="cadastre-add-form">
                Saqlash
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
