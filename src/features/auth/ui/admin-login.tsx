import { z } from 'zod';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/entities/auth';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
// @ts-ignore
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { clsx } from 'clsx';

const adminLoginFormSchema = z.object({
  username: z.string(),
  password: z.string().min(8, 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak'),
});

type AdminLoginDTO = z.infer<typeof adminLoginFormSchema>;

export function AdminLoginForm({ className }: ComponentPropsWithoutRef<'form'>) {
  const { t } = useTranslation('admin');

  const { mutateAsync, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  //const [showCaptchaError, setCaptchaError] = useState(false);
  //const [captchaValue, setCaptchaValue] = useState('');

  const form = useForm<AdminLoginDTO>({
    resolver: zodResolver(adminLoginFormSchema),
  });

  const togglePasswordVisibility = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    loadCaptchaEnginge(5);
  }, []);

  const handleLogin = async (data: z.infer<typeof adminLoginFormSchema>) => {
    await mutateAsync(data);

    /* if (validateCaptcha(captchaValue)) {
    await mutateAsync(data);
    } else {
    setCaptchaError(true);
    } */
  };

  return (
    <Form {...form}>
      <form
        className={cn('w-full flex flex-col items-center justify-center gap-6', className)}
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <div className="w-3/5 3xl:w-2/5">
          {/*<div className="fixed top-4 right-4">
            <LanguageDropdown />
          </div>*/}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">{t('admin_panel')}</h1>
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
                    <div className="relative flex items-center rounded border border-neutral-300 focus-within:ring-1 focus-within:ring-teal pr-2">
                      <Input
                        {...field}
                        placeholder={t('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="border-0 focus-visible:ring-0"
                      />
                      <button type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <EyeOffIcon className="size-5 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="size-5 text-muted-foreground" />
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
              <div
                className={clsx(
                  'relative flex items-center rounded border border-neutral-300 focus-within:ring-1 focus-within:ring-teal w-full',
                  /* {
                    ['border-red-500']: showCaptchaError,
                  }, */
                )}
              >
                <Input
                  placeholder={t('captcha')}
                  type={'text'}
                  //onChange={(val) => setCaptchaValue(val.target.value)}
                  className="border-0 focus-visible:ring-0 w-full"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={isPending} disabled={isPending}>
              {t('sign_in')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
