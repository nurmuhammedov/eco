import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { useState } from 'react';
import { ApplicationLogsList } from '@/features/application/application-logs';

const ApplicationLogsModal = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button>Ilovalar jurnallari</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1124px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Ilovalar jurnallari</DialogTitle>
          </DialogHeader>
          <ApplicationLogsList />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationLogsModal;
