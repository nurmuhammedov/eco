import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx';

import { FC } from 'react';
import { Badge } from '@/shared/components/ui/badge.tsx';

interface Props {
  signers: any;
  setSigners: (signers: any[]) => void;
}

const SignersModal: FC<Props> = ({ signers, setSigners }) => {
  const handleModal = (isOpen: boolean) => {
    if (!isOpen) {
      setSigners([]);
    }
  };
  return (
    <Dialog onOpenChange={handleModal} open={!!signers.length}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Imzolagan shaxslar</DialogTitle>
        </DialogHeader>
        <div>
          {signers.map((signer: any) => {
            return (
              <div className="flex items-center justify-between text-sm odd:bg-slate-200/20 rounded  p-1.5">
                <p>{signer?.signedBy}</p>
                <p className="shrink-0">
                  <Badge variant="success">Test</Badge>
                </p>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignersModal;
