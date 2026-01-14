import { Button } from '@/shared/components/ui/button'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateDecreeSigner } from '@/entities/admin/decree-signers/api/mutations'
import { apiClient } from '@/shared/api/api-client'
import { useQuery } from '@tanstack/react-query'

const schema = z.object({
  userId: z.string({ required_error: 'Foydalanuvchini tanlang' }),
  belongType: z.enum(['IRS_XRAY', 'OTHER'], { required_error: "Bo'limni tanlang" }),
})

interface AddDecreeSignerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AddDecreeSignerModal = ({ open, onOpenChange }: AddDecreeSignerModalProps) => {
  const { mutate: createSigner, isPending } = useCreateDecreeSigner(() => {
    onOpenChange(false)
    form.reset()
  })

  // Foydalanuvchilarni olish
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['committee-users-select'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: any[] }>('/users/committee-users/select')
      return response.data?.data || []
    },
    enabled: open,
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: z.infer<typeof schema>) => {
    createSigner(values)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col">
        <SheetHeader>
          <SheetTitle>Imzolovchi shaxs qo'shish</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-1 flex-col space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foydalanuvchi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isUsersLoading ? 'Yuklanmoqda...' : 'Foydalanuvchini tanlang'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
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
              name="belongType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yo‘nalish</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yo‘nalishni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IRS_XRAY">INM va Rentgen</SelectItem>
                      <SelectItem value="OTHER">Boshqalar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-1" />
            <SheetFooter className="mt-auto w-full gap-2 sm:space-x-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full flex-1">
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending} className="w-full flex-1">
                Saqlash
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
