import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Trash } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import DatePicker from '@/shared/components/ui/datepicker'
import DetailRow from '@/shared/components/common/detail-row'
import GoBack from '@/shared/components/common/go-back'

import useAdd from '@/shared/hooks/api/useAdd'
import useData from '@/shared/hooks/api/useData'
import { Accident, accidentSchema, InjuryStatus } from '@/features/accident/model/types'
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api.ts'

export const AccidentAdd: React.FC = () => {
  const navigate = useNavigate()
  const createMutation = useAdd<Accident, any, any>('/accidents')

  const [stir, setStir] = useState('')
  const [searchedStir, setSearchedStir] = useState<string | null>(null)

  const form = useForm<any>({
    resolver: zodResolver(accidentSchema),
    defaultValues: {
      hfId: '',
      date: undefined,
      shortDetail: '',
      lettersInfo: '',
      analyses: '',
      preventions: '',
      recommendations: '',
      victims: [
        {
          fullName: '',
          birthYear: '',
          position: '',
          experience: '',
          maritalStatus: '',
          injuryStatus: undefined,
        },
      ],
    },
  })

  // Queries for Search
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'victims',
  })

  // Ensure at least one victim exists
  useEffect(() => {
    if (fields.length === 0) {
      append({
        fullName: '',
        birthYear: '',
        position: '',
        experience: '',
        maritalStatus: '',
        injuryStatus: undefined,
      })
    }
  }, [fields.length, append])

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

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="lettersInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Hujjat qaysi huquqni muhofaza qiluvchi organlarga yuborilgan, xat sanasi va raqami
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={7} placeholder="Ma’lumotlarni kiriting..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="analyses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baxtsiz hodisa asosiy sabablari tahlili va muammolar</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={7} placeholder="Tahlillarni kiriting..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="preventions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Sanoat xavfsizligi davlat qo‘mitasi hay’ati va korxona tomonidan ko‘rilgan profilaktik
                            choralar
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={7} placeholder="Choralarni kiriting..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recommendations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Baxtsiz hodisaning oldini olish va shunday holatlar takrorlanmasligi uchun berilgan
                            takliflar
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={7} placeholder="Takliflarni kiriting..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Jabrlanuvchilar</h3>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="relative grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3"
                      >
                        <div className="col-span-full flex items-center justify-between border-b pb-2">
                          <span className="font-semibold text-gray-700">{index + 1}-jabrlanuvchi</span>
                          {index !== 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => remove(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`victims.${index}.fullName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>F.I.Sh.</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="F.I.Sh." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`victims.${index}.birthYear`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Tug‘ilgan yili</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="Tug‘ilgan yili" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`victims.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Egallagan lavozimi</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Lavozim" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`victims.${index}.experience`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Ish staji (yil)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="Ish staji" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`victims.${index}.maritalStatus`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Oilaviy ahvoli</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Oilaviy ahvoli" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`victims.${index}.injuryStatus`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Sodir bo‘lgan baxtsiz hodisa oqibati</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tanlang" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={InjuryStatus.MINOR}>Yengil</SelectItem>
                                  <SelectItem value={InjuryStatus.SERIOUS}>Og‘ir</SelectItem>
                                  <SelectItem value={InjuryStatus.FATAL}>O‘lim</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() =>
                          append({
                            fullName: '',
                            birthYear: '',
                            position: '',
                            experience: '',
                            maritalStatus: '',
                            injuryStatus: undefined,
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Qo‘shish
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <Button type="submit">Saqlash</Button>
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
