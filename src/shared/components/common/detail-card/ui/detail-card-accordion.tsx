import Icon from '@/shared/components/common/icon'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { cn } from '@/shared/lib/utils'
import { FC } from 'react'
import type { DetailCardAccordionItemProps, DetailCardAccordionProps } from '../model/detail-card-types'

export const DetailCardAccordion: FC<DetailCardAccordionProps> & {
  Item: FC<DetailCardAccordionItemProps>
} = ({ children, defaultValue = [] }) => {
  // const type = multiple ? 'multiple' : 'single';
  return (
    <Accordion type={'multiple'} defaultValue={defaultValue} className="w-full rounded-lg">
      {children}
    </Accordion>
  )
}

DetailCardAccordion.Item = ({ value, title, children, className, icon = 'word' }) => {
  return (
    <AccordionItem value={value} className={cn('mb-3 rounded-lg bg-blue-200', className)}>
      <AccordionTrigger className="3xl:py-2.5 px-4 py-2 text-blue-400">
        <div className="3xl:text-base flex items-center gap-2 font-semibold text-blue-400">
          {icon && <Icon name={icon} className="3xl:size-5 size-5" />}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="rounded-b-lg bg-white px-4 py-2">{children}</AccordionContent>
    </AccordionItem>
  )
}
