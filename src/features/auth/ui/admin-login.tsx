import { z } from 'zod'
import { cn } from '@/shared/lib/utils'
import { useForm } from 'react-hook-form'
import { useLogin } from '@/entities/auth'
import { useTranslation } from 'react-i18next'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { ComponentPropsWithoutRef, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'

const adminLoginFormSchema = z.object({
  username: z.string().min(1, 'Login kiritilishi shart'),
  password: z.string().min(8, 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak'),
})

type AdminLoginDTO = z.infer<typeof adminLoginFormSchema>

export function AdminLoginForm({ className }: ComponentPropsWithoutRef<'form'>) {
  const { t } = useTranslation('admin')
  const { mutate: login, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<AdminLoginDTO>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: { username: '', password: '' },
  })

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        className={cn('flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center gap-6', className)}
        onSubmit={form.handleSubmit((data) => login(data))}
      >
        <div className="3xl:w-2/5 w-[90%] sm:w-3/5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold whitespace-nowrap">{t('admin_panel')}</h1>
          </div>
          <div className="grid gap-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('username')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('username')} autoComplete="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <div className="focus-within:ring-teal relative flex items-center rounded border border-neutral-300 pr-2 focus-within:ring-1">
                      <Input
                        {...field}
                        placeholder={t('password')}
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        className="border-0 focus-visible:ring-0"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={showPassword ? t('hide_password') : t('show_password')}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="text-muted-foreground size-5" />
                        ) : (
                          <EyeIcon className="text-muted-foreground size-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" loading={isPending} disabled={isPending}>
              {t('sign_in')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
