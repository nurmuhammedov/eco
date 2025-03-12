import React, { Fragment, memo, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { BaseDrawerProps } from '../types';
import { DrawerFooterActions } from './footer-action';
import { Button } from '@/shared/components/ui/button';
import { DialogDescription } from '@/shared/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';

export const BaseDrawer = memo(function BaseDrawer({
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
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (onSubmit) onSubmit();
    },
    [onSubmit],
  );

  const contentClassName = useMemo(
    () => cn('sm:!max-w-sm 3xl:!max-w-md', className),
    [className],
  );

  const drawerHeader = useMemo(
    () => (
      <DrawerHeader className="text-left shadow-xs border-b py-4 flex flex-row items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClose}
          aria-label="Close Drawer"
          className="border-none size-5 3xl:size-8 shadow-none"
        >
          <X className="text-neutral-400" />
        </Button>
        <DrawerTitle className="truncate">{title}</DrawerTitle>
      </DrawerHeader>
    ),
    [title, handleClose],
  );

  const footerComponent = useMemo(() => {
    if (footer === null) return null;

    return (
      <DrawerFooter className="border-t py-4 flex">
        {footer || (
          <DrawerFooterActions
            loading={loading}
            onCancel={handleClose}
            disabled={disabled}
            onSubmit={handleSubmit}
            showCancel={showCancelButton}
            showSubmit={showSubmitButton}
          />
        )}
      </DrawerFooter>
    );
  }, [
    footer,
    loading,
    handleClose,
    disabled,
    handleSubmit,
    showCancelButton,
    showSubmitButton,
  ]);

  const contentElement = useMemo(
    () => <div className="p-4 flex-1 overflow-auto">{children}</div>,
    [children],
  );

  const containerElement = useMemo(() => {
    const commonProps = {
      children: (
        <Fragment>
          {drawerHeader}
          {contentElement}
          {footerComponent}
        </Fragment>
      ),
      className: 'flex flex-col h-full',
    };

    return asForm ? (
      <form autoComplete="off" onSubmit={handleSubmit} {...commonProps} />
    ) : (
      <div {...commonProps} />
    );
  }, [asForm, drawerHeader, contentElement, footerComponent, handleSubmit]);

  if (!open) return null;

  return (
    <Drawer open={open} direction={direction} onClose={handleClose} {...props}>
      <DrawerContent className={contentClassName}>
        <DialogDescription />
        {containerElement}
      </DrawerContent>
    </Drawer>
  );
});
