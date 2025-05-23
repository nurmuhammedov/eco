import React from 'react';
import { cn } from '@/shared/lib/utils.ts';
import { Card } from '@/shared/components/ui/card.tsx';

type CardFormProps = {
  className?: string;
  children: React.ReactNode;
};

export const CardForm = ({ children, className }: CardFormProps) => (
  <Card className={cn('px-5 py-4 3xl:px-6 3xl:py-5 rounded-lg', className)}>{children}</Card>
);
