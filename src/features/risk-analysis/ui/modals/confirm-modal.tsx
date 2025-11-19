import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import React from 'react';
import { useAdd, useCustomSearchParams } from '@/shared/hooks';
import { riskAnalysisData } from '@/shared/constants/risk-analysis-data';
import { idNames } from '@/features/risk-analysis/hooks/use-reject-risk-item';
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys';
import { useQueryClient } from '@tanstack/react-query';

interface ConfirmWithRegistryModalProps {
  documentId?: string;
}

const ConfirmModal: React.FC<ConfirmWithRegistryModalProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const {
    paramsObject: { type = 'hf', id = undefined, tin = undefined },
  } = useCustomSearchParams();
  const currentIdName = idNames.get(type);
  const list = riskAnalysisData[type as unknown as 'hf'] as unknown as any[];
  const { mutate, isPending } = useAdd(`/${type?.toLowerCase()}-risk-indicators/success-all`);

  const onSubmit = () => {
    mutate(
      list?.map((_item: any, index: number) => ({
        indicatorType: `PARAGRAPH_${type?.toUpperCase()}_${index + 1}`,
        tin,
        description: null,
        [currentIdName as string]: id,
      })),
      {
        onSuccess: async () => {
          setIsOpen(false);
          await queryClient.invalidateQueries({ queryKey: [QK_RISK_ANALYSIS] });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button style={{ cursor: 'pointer' }} variant="success">
          Hech qanday kamchiliklar yo‘q
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Haqiqatdan ham tasdiqlaysizmi?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="pt-10 flex items-center gap-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Bekor qilish
              </Button>
            </DialogClose>
            <Button onClick={() => onSubmit()} disabled={isPending}>
              Tasdiqlash
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
