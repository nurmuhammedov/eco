import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { CardForm } from '@/entities/user/applications/ui';
import { ApplicationBaseDTO } from '@/entities/user/applications/model/application.dto';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

interface Props {
  form: UseFormReturn<ApplicationBaseDTO>;
}

export const ApplicantInfo = ({ form }: Props) => {
  return (
    <Form {...form}>
      <CardForm className="mt-4 2xl:mt-5 mb-2">
        <h5 className="font-semibold">Аризачи тўғрисида маълумот</h5>
        <section className="flex gap-3 mt-3 3xl:mt-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ташкилот телефон рақами</FormLabel>
                <FormControl>
                  <Input
                    className="w-xs 3xl:w-sm"
                    placeholder="Ташкилот телефон рақами"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ташкилот электрон почтаси</FormLabel>
                <FormControl>
                  <Input
                    className="w-xs 3xl:w-sm"
                    placeholder="Ташкилот электрон почтаси"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
      </CardForm>
    </Form>
  );
};
