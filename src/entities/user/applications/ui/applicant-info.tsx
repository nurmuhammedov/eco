import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { ApplicationBaseDTO } from '@/entities/user/applications/model/application.types';
import {
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
    <Card className="px-6 py-5">
      <h5 className="font-semibold">Аризачи тўғрисида маълумот</h5>
      <section className="flex gap-3 mt-4">
        <FormField
          control={form.control}
          name="applicantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ташкилот телефон рақами</FormLabel>
              <FormControl>
                <Input
                  className="w-xs"
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
          name="applicantEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ташкилот электрон почтаси</FormLabel>
              <FormControl>
                <Input
                  className="w-xs"
                  placeholder="Ташкилот электрон почтаси"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </Card>
  );
};
