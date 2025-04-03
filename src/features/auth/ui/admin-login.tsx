import { z } from 'zod';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/entities/auth';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { ComponentPropsWithoutRef, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import LanguageDropdown from '@/widgets/header/ui/intl-dropdown';

const adminLoginFormSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, 'Пароль камида 8 та белгидан иборат бўлиши керак'),
});

type AdminLoginDTO = z.infer<typeof adminLoginFormSchema>;

export default function AdminLoginForm({
  className,
}: ComponentPropsWithoutRef<'form'>) {
  const { t } = useTranslation('admin');

  const { mutateAsync, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginDTO>({
    resolver: zodResolver(adminLoginFormSchema),
  });

  const togglePasswordVisibility = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleLogin = async (data: z.infer<typeof adminLoginFormSchema>) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form
        className={cn(
          'w-1/2 flex flex-col items-center justify-center gap-6',
          className,
        )}
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <div className="w-3/5 3xl:w-2/5">
          <div className="fixed top-4 right-4">
            <LanguageDropdown />
          </div>
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
                      <button onClick={togglePasswordVisibility}>
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
            <Button
              type="submit"
              className="w-full"
              loading={isPending}
              disabled={isPending}
            >
              {t('sign_in')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
