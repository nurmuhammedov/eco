import { FC, ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import Icon, { IconName } from '@/shared/components/common/icon';
import { cn } from '@/shared/lib/utils.ts';

interface DetailCardAccordionProps {
  children: ReactNode;
}

interface DetailCardAccordionItemProps {
  id: string;
  title: string;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export const DetailCardAccordion: FC<DetailCardAccordionProps> & {
  Item: FC<DetailCardAccordionItemProps>;
} = ({ children }) => {
  return (
    <Accordion type="single" collapsible className="w-full rounded-lg">
      {children}
    </Accordion>
  );
};

DetailCardAccordion.Item = ({
  id,
  title,
  children,
  className,
  icon = 'word',
}) => {
  return (
    <AccordionItem
      value={id}
      className={cn('bg-blue-200 rounded-lg', className)}
    >
      <AccordionTrigger className="text-blue-400 px-4 py-5">
        <div className="flex items-center gap-2 text-lg text-blue-400 font-semibold">
          {icon && <Icon name={icon} />}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-white px-4 py-2 rounded-b-lg">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
