import { FC } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import Icon from '@/shared/components/common/icon';
import type {
  DetailCardAccordionItemProps,
  DetailCardAccordionProps,
} from '../model/detail-card-types';

export const DetailCardAccordion: FC<DetailCardAccordionProps> & {
  Item: FC<DetailCardAccordionItemProps>;
} = ({ multiple = true, children }) => {
  const type = multiple ? 'multiple' : 'single';
  return (
    <Accordion type={type} collapsible className="w-full rounded-lg">
      {children}
    </Accordion>
  );
};

DetailCardAccordion.Item = ({
  value,
  title,
  children,
  className,
  icon = 'word',
}) => {
  return (
    <AccordionItem
      value={value}
      className={cn('bg-blue-200 rounded-lg', className)}
    >
      <AccordionTrigger className="text-blue-400 px-4 py-4 3xl:py-5">
        <div className="flex items-center gap-2 3xl:text-lg text-blue-400 font-semibold">
          {icon && <Icon name={icon} className="size-5 3xl:size-6" />}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-white px-4 py-2 rounded-b-lg">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
