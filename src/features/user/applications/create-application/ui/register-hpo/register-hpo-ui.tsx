import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { CardForm } from '@/entities/user/applications/ui/application-form-card';
import {
  ApplicationType,
  CreateRegisterHpoDTO,
} from '@/entities/user/applications/model/application.types';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select.tsx';

interface Props {
  form: UseFormReturn<CreateRegisterHpoDTO>;
}

export const RegisterHPOForm = ({ form }: Props) => {
  const onSubmit = (data: CreateRegisterHpoDTO) =>
    console.log("Yuborilgan ma'lumot:", data);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
      <CardForm className="mt-2 mb-5">
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-4/5 mb-5">
          <FormField
            control={form.control}
            name="account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ҳисобга олиш рақами</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Ҳисобга олиш рақами"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parent_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Юқори ташкилотнинг номи (мавжуд бўлса)</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Юқори ташкилотнинг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО дан фойдаланувчи ташкилот номи</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Юқори ташкилотнинг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ХИЧО дан фойдаланувчи ташкилот почта манзили
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧОдан фойдаланувчи ташкилот почта манзили"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>СТИР</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Солиқ тўловчининг идентификацион рақами"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hpo_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО нинг номи</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО нинг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hpo_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО нинг тури</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="Ариза тури" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ApplicationType).map((type) => (
                        <SelectItem value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hpo_objects_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-2xs 3xl:w-sm">
                  ХИЧО цехлари, участкалари, майдончалари ва бошқа ишлаб чиқариш
                  объектларининг номи
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО цехлари, участкалари, майдончалари ва бошқа ишлаб чиқариш объектларининг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hazardous_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-2xs 3xl:w-sm">
                  ВМнинг 2008 йил 10 декабрдаги 271-сон қарорига мувофиқ хавфли
                  моддаларнинг номи ва миқдори
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ВМнинг 2008 йил 10 декабрдаги 271-сон қарорига мувофиқ хавфли моддаларнинг номи ва миқдори"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="networks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тармоқлар</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Тармоқлар"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО вилояти</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО вилояти"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО тумани</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО тумани"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО манзили</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО манзили"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ариза баёни</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  className="3xl:w-4/6"
                  placeholder="Ариза баёни"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardForm>
      <Button type="submit" className="bg-blue-400">
        Ариза яратиш
      </Button>
    </form>
  );
};
