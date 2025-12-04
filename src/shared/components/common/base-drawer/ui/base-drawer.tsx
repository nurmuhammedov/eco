import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { BaseDrawerProps } from '../types'
import { DrawerFooterActions } from './footer-action'
import { Button } from '@/shared/components/ui/button'
import { DialogDescription } from '@/shared/components/ui/dialog'
import React, { Fragment, memo, useCallback, useMemo } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/components/ui/drawer'
import { useAppSelector } from '@/shared/hooks/use-store.ts'
import { UIModeEnum } from '@/shared/types'

export const BaseDrawer = memo(function BaseDrawer({
  open,
  title,
  footer,
  onClose,
  loading,
  children,
  onSubmit,
  disabled,
  asForm = false,
  className = '',
  direction = 'right',
  showCancelButton = true,
  showSubmitButton = true,
  ...props
}: BaseDrawerProps) {
  const { mode } = useAppSelector((state) => state.ui)
  const handleClose = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (onSubmit) onSubmit()
    },
    [onSubmit]
  )

  const contentClassName = useMemo(() => cn('sm:!max-w-sm 3xl:!max-w-md', className), [className])

  const drawerHeader = useMemo(
    () => (
      <DrawerHeader className="flex flex-row items-center gap-2 border-b py-3 text-left shadow-xs 2xl:py-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClose}
          aria-label="Close Drawer"
          className="3xl:!size-8 !size-6 border-none shadow-none"
        >
          <X className="text-neutral-400" />
        </Button>
        <DrawerTitle className="truncate">{title}</DrawerTitle>
      </DrawerHeader>
    ),
    [title, handleClose]
  )

  const footerComponent = useMemo(() => {
    if (footer === null || mode === UIModeEnum.VIEW) return null

    return (
      <DrawerFooter className="flex border-t py-4">
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
    )
  }, [footer, loading, handleClose, disabled, handleSubmit, showCancelButton, showSubmitButton])

  const contentElement = useMemo(() => <div className="flex-1 overflow-auto p-4">{children}</div>, [children])

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
    }

    return asForm ? <form autoComplete="off" onSubmit={handleSubmit} {...commonProps} /> : <div {...commonProps} />
  }, [asForm, drawerHeader, contentElement, footerComponent, handleSubmit])

  if (!open) return null

  return (
    <Drawer open={open} direction={direction} onClose={handleClose} {...props}>
      <DrawerContent className={contentClassName}>
        <DialogDescription />
        {containerElement}
      </DrawerContent>
    </Drawer>
  )
})
