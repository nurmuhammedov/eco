import React, { Fragment } from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/components/ui/input';
import { CreateRegionDTO } from '@/entities/admin/region';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

interface RegionFormFieldsProps {
  control: Control<CreateRegionDTO>;
}

const MAX_INPUT_NUMBER = 32000;

export const RegionFormFields: React.FC<RegionFormFieldsProps> = ({
  control,
}) => {
  const { t } = useTranslation('common');

  return (
    <Fragment>
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
