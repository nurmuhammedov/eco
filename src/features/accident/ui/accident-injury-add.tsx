import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import DatePicker from '@/shared/components/ui/datepicker'
import DetailRow from '@/shared/components/common/detail-row'
import GoBack from '@/shared/components/common/go-back'

import useAdd from '@/shared/hooks/api/useAdd'
import useData from '@/shared/hooks/api/useData'
import { accidentCreateSchema } from '@/features/accident/model/types'
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api.ts'

export const AccidentAdd: React.FC = () => {
  const navigate = useNavigate()
  const createMutation = useAdd<any, any, any>('/accidents/injury')

  const [stir, setStir] = useState('')
  const [searchedStir, setSearchedStir] = useState<string | null>(null)

  const form = useForm<any>({
    resolver: zodResolver(accidentCreateSchema),
    defaultValues: {
      hfId: '',
      date: undefined,
      shortDetail: '',
    },
  })

  const {
    data: legalInfo,
    isFetching: isLegalInfoLoading,
    isError: isLegalInfoError,
  } = useData<any>(`/users/legal/${searchedStir}`, !!searchedStir && searchedStir.length === 9)

  const { data: hfoOptions, isFetching: isHfoLoading } = useQuery({
    queryKey: ['hfoSelect', searchedStir],
    queryFn: () => getHfoByTinSelect(searchedStir!),
    enabled: !!searchedStir,
    retry: 1,
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

  const onSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/accidents')
      },
    })
  }

  const hasLegalInfo = !!legalInfo && !isLegalInfoError

  return (
    <div className="container mx-auto space-y-4 p-4">
      <GoBack title="Yangi baxtsiz hodisa qo‘shish" />

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

          <Card className="pt-5">
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="hfId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>XICHO</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isHfoLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Obyektni tanlang..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hfoOptions?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {`${option.registryNumber || 'N/A'} - ${option.name}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Sana</FormLabel>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Sanani tanlang"
                            disableStrategy="after"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortDetail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Qisqacha tafsilot</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Qisqacha tafsilot..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-start">
                    <Button type="submit" loading={createMutation.isPending}>
                      Saqlash
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
