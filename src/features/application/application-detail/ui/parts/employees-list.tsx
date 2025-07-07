// src/features/application/application-detail/ui/parts/employees-list.tsx

import { EmployeeLevel } from '@/entities/attestation/model/attestation.types.ts';
import { useExecuteAttestation } from '@/features/application/application-detail/hooks/mutations/use-execute-attestation.tsx';
import { DataTable } from '@/shared/components/common/data-table';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import DateTimePicker from '@/shared/components/ui/datetimepicker.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group.tsx';
import { getDate } from '@/shared/utils/date.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

interface Employee {
  pin: string;
  level: EmployeeLevel;
  certDate: string;
  fullName: string;
  certNumber: string;
  profession: string;
  certExpiryDate: string;
  dateOfEmployment: string;
  ctcTrainingToDate: string;
  ctcTrainingFromDate: string;
}

interface EmployeesListProps {
  data: Employee[];
  showAttestationActions?: boolean;
}

const attestationSchema = z.object({
  dateOfAttestation: z.date({ required_error: 'Attestatsiya sanasi majburiy' }),
  filePath: z.string().min(1, 'Bayonnoma fayli majburiy'),
  result: z.record(z.enum(['PASSED', 'FAILED']), {
    required_error: '',
  }),
});

type AttestationFormValues = z.infer<typeof attestationSchema>;

const EmployeesList = ({ data, showAttestationActions = true }: EmployeesListProps) => {
  const { t } = useTranslation(['common']);
  const { id: appealId } = useParams<{ id: string }>();
  const { onSubmit: executeAttestation, isPending } = useExecuteAttestation(appealId || '');

  const form = useForm<AttestationFormValues>({
    resolver: zodResolver(attestationSchema),
    defaultValues: {
      result: {},
    },
  });

  const onSubmit = (formData: AttestationFormValues) => {
    const payload = {
      ...formData,
      dateOfAttestation: format(formData.dateOfAttestation, "yyyy-MM-dd'T'HH:mm"),
      appealId,
    };
    executeAttestation(payload);
  };

  const levelTranslations: Record<EmployeeLevel, string> = {
    [EmployeeLevel.LEADER]: t('attestation.LEADER'),
    [EmployeeLevel.TECHNICIAN]: t('attestation.TECHNICIAN'),
    [EmployeeLevel.EMPLOYEE]: t('attestation.EMPLOYEE'),
  };

  const columns: ColumnDef<Employee>[] = [
    {
      header: '№',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'fullName',
      header: 'Xodim FIO',
    },
    {
      accessorKey: 'dateOfEmployment',
      header: 'Ishga kirgan sanasi',
      cell: ({ row }) => getDate(row.original.dateOfEmployment),
    },
    {
      accessorKey: 'level',
      header: 'Lavozimi',
      cell: ({ row }) => levelTranslations[row.original.level] || row.original.level,
    },
    {
      accessorKey: 'pin',
      header: 'JSHIR',
    },
    {
      accessorKey: 'profession',
      header: 'Kasbi',
    },
    {
      accessorKey: 'certNumber',
      header: 'Sertifikat raqami',
    },
    {
      accessorKey: 'certDate',
      header: 'Sertifikat sanasi',
      cell: ({ row }) => getDate(row.original.certDate),
    },
    {
      accessorKey: 'certExpiryDate',
      header: 'Sertifikat muddati',
      cell: ({ row }) => getDate(row.original.certExpiryDate),
    },
    {
      accessorKey: 'ctcTrainingFromDate',
      header: '“Kontexnazorato‘quv” DMda o‘qigan muddati (dan)',
      cell: ({ row }) => getDate(row.original.ctcTrainingFromDate),
    },
    {
      accessorKey: 'ctcTrainingToDate',
      header: '“Kontexnazorato‘quv” DMda o‘qigan muddati (gacha)',
      cell: ({ row }) => getDate(row.original.ctcTrainingToDate),
    },
  ];

  if (showAttestationActions) {
    columns.push({
      id: 'attestationResult',
      header: 'Attestatsiya natijasi',
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`result.${row.original.pin}`}
          render={({ field }) => (
            <FormItem>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                <FormItem className="flex items-center space-x-2">
                  <RadioGroupItem value="PASSED" id={`${row.original.pin}-passed`} />
                  <FormLabel htmlFor={`${row.original.pin}-passed`}>O‘tdi</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <RadioGroupItem value="FAILED" id={`${row.original.pin}-failed`} />
                  <FormLabel htmlFor={`${row.original.pin}-failed`}>O‘tmadi</FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {showAttestationActions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4">
            <FormField
              control={form.control}
              name="dateOfAttestation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attestatsiyadan o'tish sanasi</FormLabel>
                  <DateTimePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Bayonnoma fayli</FormLabel>
                  <FormControl>
                    <InputFile
                      form={form}
                      name={field.name}
                      accept={[FileTypes.PDF]}
                      onUploadComplete={(url) => form.setValue('filePath', url, { shouldValidate: true })}
                      buttonText="Fayl yuklash"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
        <DataTable columns={columns} data={data || []} />
        {showAttestationActions && (
          <div className="flex justify-end mt-4">
            <Button type="submit" loading={isPending}>
              Yakunlash
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default EmployeesList;
