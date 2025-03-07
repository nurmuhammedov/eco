import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { BaseDrawerProps } from '../types';
import { DrawerFooterActions } from './footer-action';
import { Button } from '@/shared/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';

export function BaseDrawer({
  open,
  title,
  footer,
  onClose,
  children,
  onSubmit,
  loading,
  disabled,
  asForm = false,
  className = '',
  direction = 'right',
  showCancelButton = true,
  showSubmitButton = true,
  ...props
}: BaseDrawerProps) {
  return (
    <Drawer open={open} direction={direction} onClose={onClose} {...props}>
      <DrawerContent className={cn('sm:!max-w-sm 3xl:!max-w-md', className)}>
        <DrawerHeader className="text-left shadow-xs border-b py-4 flex flex-row items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label="Close Drawer"
            className="border-none size-8 shadow-none"
          >
            <X className="text-neutral-400" />
          </Button>
          <DrawerTitle className="truncate">{title}</DrawerTitle>
        </DrawerHeader>

        {asForm ? (
          <form
            autoComplete="off"
            onSubmit={onSubmit}
            className="flex flex-col h-full"
          >
            <div className="p-4 flex-1 overflow-auto">{children}</div>
            {footer !== null && (
              <DrawerFooter className="border-t py-4 flex">
                {footer || (
                  <DrawerFooterActions
                    loading={loading}
                    onCancel={onClose}
                    disabled={disabled}
                    onSubmit={onSubmit}
                    showCancel={showCancelButton}
                    showSubmit={showSubmitButton}
                  />
                )}
              </DrawerFooter>
            )}
          </form>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 flex-1 overflow-auto">{children}</div>
            {footer !== null && (
              <DrawerFooter className="border-t py-4 flex">
                {footer || (
                  <DrawerFooterActions
                    loading={loading}
                    onCancel={onClose}
                    disabled={disabled}
                    onSubmit={onSubmit}
                    showCancel={showCancelButton}
                    showSubmit={showSubmitButton}
                  />
                )}
              </DrawerFooter>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
