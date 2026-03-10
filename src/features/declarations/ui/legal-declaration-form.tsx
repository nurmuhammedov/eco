import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cleanParams } from '@/shared/lib'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import useData from '@/shared/hooks/api/useData'
import useAdd from '@/shared/hooks/api/useAdd'
import { CreateDeclarationFormValues, createDeclarationSchema } from '@/entities/declarations/model/declaration.types'

export const LegalDeclarationForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const userTin = user?.tinOrPin?.toString()

  const form = useForm<CreateDeclarationFormValues>({
    resolver: zodResolver(createDeclarationSchema),
    mode: 'onChange',
    defaultValues: {
      expertId: undefined,
      hfIds: [],
      conclusionId: undefined,
      declarationPath: undefined,
      infoLetterPath: undefined,
      explanatoryNotePath: undefined,
    },
  })

  const { data: activeExperts } = useData<any[]>('/accreditations/active')

  const { data: hfoOptions, isFetching: isHfoLoading } = useData<any[]>('/hf/by-tin/select', !!userTin, {
    legalTin: userTin,
  })

  const { data: conclusionOptions, isFetching: isConclusionsLoading } = useData<any[]>(
    '/conclusions/select',
    !!userTin,
    { customerTin: userTin }
  )

  const {
    mutate,
    isPending: isSubmitting,
    isSuccess,
  } = useAdd<CreateDeclarationFormValues, any, any>('/declarations/by-legal')

  useEffect(() => {
    if (isSuccess) {
      navigate('/declarations')
    }
  }, [isSuccess, navigate])

  const onSubmit = (data: CreateDeclarationFormValues) => {
    mutate(cleanParams({ ...data }) as any)
  }

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Deklaratsiya maʼlumotlari</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expertId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ekspert tashkiloti</FormLabel>
                      <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Ekspertni tanlang..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeExperts?.map((expert: any) => (
                            <SelectItem key={expert.id} value={expert.id.toString()}>
                              {expert.legalName}
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
                  name="conclusionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ekspertiza xulosasi</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isConclusionsLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Xulosani tanlang..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conclusionOptions?.map((option: any) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.registryNumber || 'Nomaʼlum xulosa'}
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
                  name="hfIds"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>XICHOlar</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            hfoOptions?.map((opt: any) => ({
                              id: opt.id,
                              name: `${opt.registryNumber || 'N/A'} - ${opt.name}`,
                            })) || []
                          }
                          value={field.value}
                          onChange={(vals) => field.onChange(vals as string[])}
                          disabled={isHfoLoading}
                          placeholder="Obyektlarni tanlang..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="declarationPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Deklaratsiya</FormLabel>
                      <FormControl>
                        <InputFile
                          buttonText="Faylni tanlang"
                          form={form}
                          uploadEndpoint="/attachments/declarations"
                          name={field.name}
                          accept={[FileTypes.PDF]}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="infoLetterPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Axborotnoma</FormLabel>
                      <FormControl>
                        <InputFile
                          buttonText="Faylni tanlang"
                          form={form}
                          uploadEndpoint="/attachments/declarations"
                          name={field.name}
                          accept={[FileTypes.PDF]}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="explanatoryNotePath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Hisob-kitob tushuntirish xati</FormLabel>
                      <FormControl>
                        <InputFile
                          buttonText="Faylni tanlang"
                          form={form}
                          uploadEndpoint="/attachments/declarations"
                          name={field.name}
                          accept={[FileTypes.PDF]}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-full md:w-40">
                  Yuborish
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
