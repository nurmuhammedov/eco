import { z } from 'zod';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';
import { ComponentPropsWithoutRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

const adminLoginFormSchema = z.object({
  login: z.string(),
  password: z
    .string()
    .min(8, 'Пароль камида 8 та белгидан иборат бўлиши керак'),
});

type AdminLoginDTO = z.infer<typeof adminLoginFormSchema>;

export default function AdminLoginForm({
  className,
}: ComponentPropsWithoutRef<'form'>) {
  const form = useForm<AdminLoginDTO>({
    resolver: zodResolver(adminLoginFormSchema),
  });

  const handleLogin = (data: AdminLoginDTO) => {
    console.log('handleLogin', data);
  };

  return (
    <Form {...form}>
      <form
        className={cn(
          'w-1/2 flex flex-col items-center justify-center gap-6',
          className,
        )}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <div className="w-3/5 3xl:w-2/5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Маъмур панели</h1>
          </div>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input required placeholder="Логин" {...field} />
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
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      placeholder="Пароль"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Кириш
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
