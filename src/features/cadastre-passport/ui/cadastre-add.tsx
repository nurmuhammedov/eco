import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Search } from 'lucide-react'
import GoBack from '@/shared/components/common/go-back'
import DetailRow from '@/shared/components/common/detail-row'
import { toast } from 'sonner'
import useData from '@/shared/hooks/api/useData'
import useAdd from '@/shared/hooks/api/useAdd'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { cadastreDataSchema, CadastreDataFields } from './components/cadastre-data-fields'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

const schema = z.object({
  attributeFile: z.string().min(1, FORM_ERROR_MESSAGES.required),
  passportFile: z.string().min(1, FORM_ERROR_MESSAGES.required),
  parentRequestNumber: z.string().optional(),
  cadastreData: cadastreDataSchema,
})

// A STIR is exactly nine digits; anything else is the schema's business rather
// than a toast that leaves the field looking valid.
const searchSchema = z.object({
  stir: z
    .string({ required_error: FORM_ERROR_MESSAGES.required })
    .min(1, FORM_ERROR_MESSAGES.required)
    .regex(/^\d{9}$/, FORM_ERROR_MESSAGES.invalid),
})

type FormValues = z.infer<typeof schema>
type SearchValues = z.infer<typeof searchSchema>

export default function CadastreAdd() {
  const navigate = useNavigate()

  const { mutate: createCadastre } = useAdd<any, any, any>('/cadastre-passports')

  const [searchedStir, setSearchedStir] = useState<string | null>(null)

  const searchForm = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { stir: '' },
  })

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
      parentRequestNumber: '',
      cadastreData: {} as any,
    },
  })

  const handleSearch = ({ stir }: SearchValues) => setSearchedStir(stir)

  const handleClearSearch = () => {
    setSearchedStir(null)
    searchForm.reset({ stir: '' })
    form.reset()
  }

  /**
   * A TIN that no organisation answers to is not a valid entry either, so it is
   * reported on the field rather than left to a toast the user has to connect
   * back to the input.
   */
  useEffect(() => {
    if (isLegalInfoError) searchForm.setError('stir', { message: FORM_ERROR_MESSAGES.invalid })
  }, [isLegalInfoError, searchForm])

  const onSubmit = (data: FormValues) => {
    createCadastre(
      {
        customerTin: Number(searchedStir),
        detailFilePath: data.attributeFile,
        passportFilePath: data.passportFile,
        parentRequestNumber: data.parentRequestNumber?.trim() || null,
        ...data.cadastreData,
      },
      {
        onSuccess: () => {
          toast.success('So‘rov yuborildi')
          navigate('/cadastre-passport')
        },
      }
    )
  }

  const hasLegalInfo = !!legalInfo && !isLegalInfoError

  return (
    <div className="space-y-4 pb-4">
      <GoBack title="TXYZ kadastr qo‘shish" />

      <Card>
        <CardHeader>
          <CardTitle>Tashkilotni qidirish</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...searchForm}>
            {/* A form, so Enter searches - a lone button next to an input does not. */}
            <form onSubmit={searchForm.handleSubmit(handleSearch)} className="flex items-start gap-4">
              <FormField
                control={searchForm.control}
                name="stir"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Tashkilot STIRini kiriting..."
                        inputMode="numeric"
                        maxLength={9}
                        disabled={hasLegalInfo || isLegalInfoLoading}
                        {...field}
                        // Letters would pass the length check and 404 on the server.
                        onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {hasLegalInfo ? (
                <Button type="button" variant="destructive" onClick={handleClearSearch} className="w-40">
                  O‘chirish
                </Button>
              ) : (
                <Button type="submit" disabled={isLegalInfoLoading} className="w-40" loading={isLegalInfoLoading}>
                  <Search className="mr-2 h-4 w-4" /> Qidirish
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {hasLegalInfo && (
        <Form {...form}>
          <form id="cadastre-add-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {/* Three fields in a four-column grid left a dead quarter on the right. */}
                <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
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
                            uploadEndpoint="/attachments/cadastre-passports"
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
                            uploadEndpoint="/attachments/cadastre-passports"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentRequestNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avvalgi ariza raqami (mavjud bo‘lsa)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ariza raqamini kiriting..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <DetailCardAccordion defaultValue={['cadastre-data']}>
              <DetailCardAccordion.Item value="cadastre-data" title="TXYZ kadastr atributiv ma’lumotlari">
                <div className="pt-2 pb-5">
                  <CadastreDataFields control={form.control} prefix="cadastreData." />
                </div>
              </DetailCardAccordion.Item>
            </DetailCardAccordion>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/cadastre-passport')}>
                Bekor qilish
              </Button>
              <Button type="submit">Saqlash</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
