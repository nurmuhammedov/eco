import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  ApplicationType,
  CreateRegisterHpoDTO,
} from '@/entities/user/applications/model/application.types';
import { useApplicationForm } from '@/features/user/applications/create-application/models/useApplicationForm';

export const RegisterHPOForm = () => {
  const form = useApplicationForm(ApplicationType.RegisterHPO);

  const onSubmit = (data: CreateRegisterHpoDTO) =>
    console.log("Yuborilgan ma'lumot:", data);
  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <Input {...form.register('name')} placeholder="Kompaniya kodi" />
        <Button type="submit">Ариза яратиш</Button>
      </form>
    </Form>
  );
};
