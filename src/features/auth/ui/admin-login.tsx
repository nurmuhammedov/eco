import { z } from 'zod'
import { cn } from '@/shared/lib/utils'
import { useForm } from 'react-hook-form'
import { useLogin } from '@/entities/auth'
import { useTranslation } from 'react-i18next'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha'
import { clsx } from 'clsx'
import { apiConfig } from '@/shared/api/constants'

const adminLoginFormSchema = z.object({
  username: z.string(),
  password: z.string().min(8, 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak'),
})

type AdminLoginDTO = z.infer<typeof adminLoginFormSchema>

export function AdminLoginForm({ className }: ComponentPropsWithoutRef<'form'>) {
  const { t } = useTranslation('admin')

  const { mutateAsync, isPending } = useLogin()

  const [showPassword, setShowPassword] = useState(false)
  const [showCaptchaError, setCaptchaError] = useState(false)
  const [captchaValue, setCaptchaValue] = useState('')

  const form = useForm<AdminLoginDTO>({
    resolver: zodResolver(adminLoginFormSchema),
  })

  const togglePasswordVisibility = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    loadCaptchaEnginge(5)
  }, [])

  const handleLogin = async (data: z.infer<typeof adminLoginFormSchema>) => {
    if (apiConfig.oneIdClientId == 'ekotizim_clone_cirns_uz') {
      if (validateCaptcha(captchaValue)) {
        await mutateAsync(data)
      } else {
        setCaptchaError(true)
      }
    } else {
      await mutateAsync(data)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center gap-6', className)}
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <div className="3xl:w-2/5 w-3/5">
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
                    <Input required placeholder={t('username')} {...field} />
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
                        type={showPassword ? 'text' : 'password'}
                        className="border-0 focus-visible:ring-0"
                      />
                      <button type="button" onClick={togglePasswordVisibility}>
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

            <div className={'flex items-center'}>
              <LoadCanvasTemplateNoReload />
              {apiConfig.oneIdClientId == 'ekotizim_clone_cirns_uz' ? (
                <div
                  className={clsx(
                    'focus-within:ring-teal relative flex w-full items-center rounded border border-neutral-300 focus-within:ring-1',
                    {
                      ['border-red-500']: showCaptchaError,
                    }
                  )}
                >
                  <Input
                    placeholder="Rasmdagi matnni kiriting"
                    onChange={(val) => setCaptchaValue(val.target.value)}
                    className="w-full border-0 focus-visible:ring-0"
                  />
                </div>
              ) : (
                <div
                  className={clsx(
                    'focus-within:ring-teal relative flex w-full items-center rounded border border-neutral-300 focus-within:ring-1'
                  )}
                >
                  <Input
                    disabled={true}
                    placeholder="Rasmdagi matnni kiriting"
                    className="w-full border-0 focus-visible:ring-0"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" loading={isPending} disabled={isPending}>
              {t('sign_in')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
