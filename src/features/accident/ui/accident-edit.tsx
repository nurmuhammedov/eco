import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Trash } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'

import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'

import useDetail from '@/shared/hooks/api/useDetail'
import useUpdate from '@/shared/hooks/api/useUpdate'
import useData from '@/shared/hooks/api/useData'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import { Accident, AccidentFormValues, accidentEditSchema, InjuryStatus } from '../model/types'

export const AccidentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { detail: accident, isLoading } = useDetail<Accident>('/accidents', id, !!id)
  const updateMutation = useUpdate<Accident, any, any>('/accidents/injury', id)

  const { data: hfoData } = useData<any>(`/hf/${accident?.hfId}`, !!accident?.hfId)

  const isCompleted = accident?.status === 'COMPLETED'

  const form = useForm<AccidentFormValues>({
    resolver: zodResolver(accidentEditSchema),
    defaultValues: {
      hfId: '',
      date: undefined,
      shortDetail: '',
      conditions: '',
      lettersInfo: '',
      analyses: '',
      preventions: '',
      recommendations: '',
      specialActPath: '',
      n1ActPath: '',
      planSchemaPath: '',
      commissionOrderPath: '',
      protocolPath: '',
      victims: [],
    },
  })

  useEffect(() => {
    if (accident) {
      if (isCompleted) {
        toast.warning('Bu baxtsiz hodisa allaqachon yakunlangan va uni tahrirlab bo‘lmaydi.')
        navigate(`/accidents/${id}`)
        return
      }

      form.reset({
        ...accident,
        date: accident.date ? new Date(accident.date) : undefined,
        shortDetail: accident.shortDetail || '',
        conditions: accident.conditions || '',
        lettersInfo: accident.lettersInfo || '',
        analyses: accident.analyses || '',
        preventions: accident.preventions || '',
        recommendations: accident.recommendations || '',
        victims:
          accident.victims?.map((v: any) => ({
            fullName: v.fullName || '',
            birthDate: v.birthDate ? new Date(v.birthDate) : undefined,
            address: v.address || '',
            position: v.position || '',
            experience: v.experience || '',
            maritalStatus: v.maritalStatus || '',
            injuryStatus: v.injuryStatus,
          })) || [],
      } as AccidentFormValues)
    }
  }, [accident, form, isCompleted, navigate, id])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'victims',
  })

  const onSubmit = (data: any) => {
    // Check if all files are uploaded
    const allFilesUploaded =
      !!data.specialActPath &&
      !!data.n1ActPath &&
      !!data.planSchemaPath &&
      !!data.commissionOrderPath &&
      !!data.protocolPath

    const currentStatus = accident?.status
    let newStatus = currentStatus

    if (allFilesUploaded) {
      newStatus = 'COMPLETED'
    } else if (currentStatus === 'NEW') {
      newStatus = 'IN_PROCESS'
    }

    const payload = {
      ...data,
      status: newStatus,
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Baxtsiz hodisa muvaffaqiyatli saqlandi')
        navigate(`/accidents/${id}`)
      },
      onError: () => {
        toast.error('Xatolik yuz berdi')
      },
    })
  }

  if (isLoading) return <div>Yuklanmoqda...</div>

  if (!accident) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto space-y-4 pb-10">
      <GoBack title="Baxtsiz hodisa ma’lumotlarini tahrirlash" />

      <DetailCardAccordion defaultValue={['form_info']}>
        <DetailCardAccordion.Item value="legal_info" title="Tashkilot to‘g‘risida ma’lumot">
          {accident.legalTin && <LegalApplicantInfo tinNumber={accident.legalTin} />}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="XICHO to‘g‘risida ma’lumot">
          <AppealMainInfo data={hfoData} type="HF" address={hfoData?.address} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="form_info" title="Tahrirlash">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Sana</FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Sanani tanlang" />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baxtsiz hodisaning shart-sharoitlari</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} value={field.value || ''} />
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
                        <Textarea {...field} rows={5} value={field.value || ''} />
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
                        <Textarea {...field} rows={5} value={field.value || ''} />
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
                        Sanoat xavfsizligi davlat qo‘mitasi hay’ati va korxona tomonidan ko‘rilgan profilaktik choralar
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} value={field.value || ''} />
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
                        Baxtsiz hodisaning oldini olish va shunday holatlar takrorlanmasligi uchun berilgan takliflar
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ilovalar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="specialActPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maxsus tekshirish dalolatnomasi</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="n1ActPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>N-1 shaklidagi dalolatnoma</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="planSchemaPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Rejalar, sxemalar, tekshirish protokoli va baxtsiz hodisa yuz bergan joyning fotosuratlari
                          </FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="commissionOrderPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maxsus tekshirish komissiyasi tuzish haqidagi buyruq yoki qaror</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="protocolPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            So‘roqlar protokoli va boshqa baxtsiz hodisaga aloqador hujjatlar to‘plami
                          </FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Jabrlanuvchilar</h3>
                </div>
                {form.formState.errors.victims && (
                  <p className="text-destructive text-sm font-medium">{form.formState.errors.victims.message}</p>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="relative grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3">
                    <div className="col-span-full flex items-center justify-between border-b pb-2">
                      <span className="font-semibold text-gray-700">{index + 1}-jabrlanuvchi</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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
                      name={`victims.${index}.birthDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Tug‘ilgan sanasi</FormLabel>
                          <DatePicker value={field.value} onChange={field.onChange} placeholder="Sanani tanlang" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`victims.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Yashash manzili</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Yashash manzili" />
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
                          <FormLabel required>Ish tajribasi (yil)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Ish tajribasi" />
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        birthDate: undefined as unknown as Date,
                        address: '',
                        position: '',
                        experience: '',
                        maritalStatus: '',
                        injuryStatus: undefined as any,
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Qo‘shish
                  </Button>
                </div>
              </div>

              <div className="flex justify-start">
                <Button type="submit" loading={updateMutation.isPending}>
                  Saqlash
                </Button>
              </div>
            </form>
          </Form>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
