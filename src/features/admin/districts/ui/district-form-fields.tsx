import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { Fragment, useMemo } from 'react';
import { Input } from '@/shared/components/ui/input';
import { useDistrictForm } from '../model/use-district-form';
import { getSelectOptions } from '@/shared/utils/get-select-options';
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
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { CreateDistrictDTO } from '@/entities/admin/districts';

interface DistrictFormFieldsProps {
  control: Control<CreateDistrictDTO>;
}

const MAX_INPUT_NUMBER = 32000;

export const DistrictFormFields: React.FC<DistrictFormFieldsProps> = ({
  control,
}) => {
  const { regions } = useDistrictForm();
  const { t } = useTranslation('common');

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions]);

  return (
    <Fragment>
      <FormField
        name="regionId"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Viloyat</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                {...field}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Viloyat tanlang" />
                </SelectTrigger>
                <SelectContent>{regionOptions}</SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="name"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('name')}</FormLabel>
            <FormControl>
              <Input placeholder={t('name')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="soato"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('soato')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                maxLength={10}
                max={MAX_INPUT_NUMBER}
                placeholder={t('soato')}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="number"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('number')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                maxLength={10}
                max={MAX_INPUT_NUMBER}
                placeholder={t('number')}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Fragment>
  );
};
