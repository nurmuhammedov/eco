import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { CadastreDataFields, CadastreRegistryFields, cadastreDataSchema } from './cadastre-data-fields'
import { splitAddress } from '../../model/txyz-options'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import useUpdate from '@/shared/hooks/api/useUpdate'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface CadastreEditModalProps {
  isOpen: boolean
  onClose: () => void
  cadastreId: string
  defaultValues?: any
}

export const CadastreEditModal = ({ isOpen, onClose, cadastreId, defaultValues }: CadastreEditModalProps) => {
  const queryClient = useQueryClient()
  const { mutate: updateCadastreData, isPending } = useUpdate<any, any, any>(
    '/cadastre-passports',
    `${cadastreId}/preparer-cadastre-data`
  )

  const form = useForm<z.infer<typeof cadastreDataSchema>>({
    resolver: zodResolver(cadastreDataSchema),
    defaultValues: defaultValues || {},
  })

  useEffect(() => {
    if (defaultValues && isOpen) {
      const formattedValues = { ...defaultValues }

      // The record keeps dates as 'yyyy-MM-dd'; the picker works on Date.
      for (const key of [
        'cadastreRegistrationDate',
        'exploitationDate',
        'stateRegistryCertDate',
        'licenseDate',
      ] as const) {
        if (formattedValues[key]) formattedValues[key] = new Date(formattedValues[key])
      }

      // The address is one string on the record and three fields on the form.
      Object.assign(formattedValues, splitAddress(defaultValues.address))

      // Coordinates come back as numbers; the masked inputs work on text.
      for (const axis of ['latitude', 'longitude'] as const) {
        const value = formattedValues[axis]
        formattedValues[axis] = value === null || value === undefined ? '' : String(value)
      }

      form.reset(formattedValues)
    }
  }, [defaultValues, isOpen, form])

  const onSubmit = (data: z.infer<typeof cadastreDataSchema>) => {
    updateCadastreData(data, {
      onSuccess: () => {
        toast.success('Ma’lumotlar muvaffaqiyatli saqlandi')
        queryClient.invalidateQueries({ queryKey: ['cadastre-passports', cadastreId] })
        onClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>TXYUZ kadastr pasportining atributiv ma’lumotlarini tahrirlash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="cadastre-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            <CadastreDataFields control={form.control} prefix="" />
            <div>
              <h6 className="mb-4 text-sm font-semibold text-gray-700">
                Davlat reestridan o‘tkazilgan obyekt to‘g‘risida ma’lumotlar
              </h6>
              <CadastreRegistryFields control={form.control} prefix="" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
