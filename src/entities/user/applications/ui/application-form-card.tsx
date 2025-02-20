import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils.ts';

type CardFormProps = {
  className?: string;
  children: React.ReactNode;
};

export const CardForm = ({ children, className }: CardFormProps) => {
  return (
    <Card className={cn('px-6 py-5 rounded-lg', className)}>{children}</Card>
  );
};
