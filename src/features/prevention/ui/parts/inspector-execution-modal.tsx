import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'

import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useAdd } from '@/shared/hooks'

const assignInspectorSchema = z.object({
  inspectorId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  report: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  resultPathList: z.array(z.string()).min(1, 'Kamida bitta fayl yuklash majburiy!'),
})

type AssignInspectorForm = z.infer<typeof assignInspectorSchema>

export const preventionTypes = [
  {
    id: 'HTST',
    name: 'Bevosita joyiga chiqmagan va tadbirkorlik subyektlari faoliyatiga aralashmagan holda huquqiy targ‘ibot, seminarlar, tushuntirish ishlari hamda amaliy mashg‘ulotlarni tashkil etish',
  },
  {
    id: 'TSPA',
    name: 'Tadbirkorlik subyektlariga pochta aloqasi yoki elektron axborot tizimlari orqali ularning faoliyati yuzasidan qonunchilik talablarini buzilishining oldini olishga qaratilgan tavsiyalar, shuningdek, faoliyat yuritayotgan sohada sodir etilayotgan tizimli huquqbuzarliklarning sabablari va ularga imkon beruvchi shart-sharoitlar to‘g‘risida xabarnomalar yuborish',
  },
  {
    id: 'AQTT',
    name: 'Amaldagi qonunchilik talablarini tushuntirish maqsadida ommaviy axborot vositalarida chiqishlar qilish',
  },
  {
    id: 'TFAO',
    name: 'Tadbirkorlik faoliyatini amalga oshirishda yuzaga kelayotgan muammolarni ommaviy muhokama qilish maqsadida Internet tarmog‘ida, jumladan, ijtimoiy tarmoqlarda veb-saytlar, bloglar va chatlar tashkil etish',
  },
  {
    id: 'OEKT',
    name: '«Ochiq eshiklar kuni» tadbirlarini tashkil etish va ularda ishtirok etish',
  },
  {
    id: 'TSQT',
    name: 'Tadbirkorlik subyektlarini qonunchilik talablariga oid ma’lumotlarni o‘z ichiga olgan tarqatma materiallar va boshqa qo‘llanmalar bilan ta’minlash',
  },
  {
    id: 'TSOT',
    name: 'Tadbirkorlik subyektlariga belgilangan tartibda tasdiqlangan cheklistni taqdim etish hamda cheklist natijalari asosida ularning faoliyatida qonunbuzilishlarga olib kelishi mumkin bo‘lgan kamchiliklarni bartaraf etishga ko‘maklashish',
  },
]

export const ExecutionInspectorModal: React.FC = () => {
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const qc = useQueryClient()

  const form = useForm<AssignInspectorForm>({
    resolver: zodResolver(assignInspectorSchema),
    defaultValues: {
      inspectorId: '',
      report: '',
      resultPathList: [],
    },
  })

  const { mutate, isPending } = useAdd<any, any, any>(`/preventions/${id}/execution`)

  const onSubmit = (data: AssignInspectorForm) => {
    if (id) {
      mutate(
        {
          report: data.report,
          type: data.inspectorId,
          resultPathList: data.resultPathList,
        },
        {
          onSuccess: async () => {
            handleClose()
            await qc?.invalidateQueries({ queryKey: ['/preventions'] })
          },
        }
      )
    }
  }

  const handleClose = () => {
    form.reset()
    setIsShow(false)
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button>Ijro etish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] w-[95vw] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profilaktika ijrosini taʼminlash</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inspectorId"
              render={({ field }) => (
                <FormItem className="max-w-115">
                  <FormLabel required={true}>Profilaktika turi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{getSelectOptions(preventionTypes || [])}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="report"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={true}>Bajarilgan ishlar ro‘yxati</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" rows={7} placeholder="Bajarilgan ishlar ro‘yxati..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="resultPathList"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={true}>Bajarilgan ishlar bo‘yicha fayllar</FormLabel>
                  <FormControl>
                    <InputFile
                      form={form}
                      multiple={true}
                      name={field.name}
                      accept={[FileTypes.IMAGE, FileTypes.PDF]}
                      buttonText="Fayllarni biriktirish"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
