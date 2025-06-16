import Icon from '@/shared/components/common/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';
import { FC } from 'react';
import type { DetailCardAccordionItemProps, DetailCardAccordionProps } from '../model/detail-card-types';

export const DetailCardAccordion: FC<DetailCardAccordionProps> & {
  Item: FC<DetailCardAccordionItemProps>;
} = ({ children, defaultValue=[] }) => {
  // const type = multiple ? 'multiple' : 'single';
  return (
    <Accordion type={'multiple'} defaultValue={defaultValue}    className="w-full rounded-lg">
      {children}
    </Accordion>
  );
};

DetailCardAccordion.Item = ({ value, title, children, className, icon = 'word' }) => {
  return (
    <AccordionItem value={value} className={cn('bg-blue-200 rounded-lg mb-3', className)}>
      <AccordionTrigger className="text-blue-400 px-4 py-2 3xl:py-2.5">
        <div className="flex items-center gap-2 3xl:text-base text-blue-400 font-semibold">
          {icon && <Icon name={icon} className="size-5 3xl:size-5" />}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-white px-4 py-2 rounded-b-lg">{children}</AccordionContent>
    </AccordionItem>
  );
};
