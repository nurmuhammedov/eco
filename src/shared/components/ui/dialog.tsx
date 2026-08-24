'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * One scale instead of the seven ad-hoc widths this codebase had grown
 * (425, 500, 525, 625, 725, 800, 5xl). Pick by what the dialog holds, not by
 * eye: a confirmation is sm, a short form md, a full form lg, a table or a map
 * xl.
 */
const DIALOG_SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[95vw]',
} as const

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideCloseIcon?: boolean
    size?: keyof typeof DIALOG_SIZES
  }
>(({ className, children, hideCloseIcon = false, size = 'md', 'aria-describedby': describedBy, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      /**
       * Radix points this at a DialogDescription it assumes exists. Only three
       * of the sixty-three dialogs here render one, so the rest advertised an
       * element that is not on the page. Passing the prop through - undefined
       * when nobody set it - overrides that default.
       */
      aria-describedby={describedBy}
      className={cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:w-full sm:rounded-lg',
        // The dialog never grows past the viewport, and only its middle scrolls
        // - the header and footer below pin themselves to the edges.
        'max-h-[85dvh] overflow-y-auto',
        DIALOG_SIZES[size],
        className
      )}
      {...props}
    >
      {children}
      {!hideCloseIcon && (
        <DialogPrimitive.Close className="ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-5 right-5 cursor-pointer rounded-full p-2 text-gray-900/80 transition-all hover:bg-gray-900/10 hover:text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <X className="h-4 w-4 stroke-[2.5]" />
          <span className="sr-only">Yopish</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Sticky rather than fixed: the dialog body is the scroll container, so
      // the title stays put while the content moves under it. The negative
      // margins let the bar span the dialog's padding.
      'bg-background sticky top-0 z-40 -mx-6 -mt-6 flex flex-col space-y-1.5 border-b px-6 pt-6 pb-4 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bg-background sticky bottom-0 z-40 -mx-6 -mb-6 flex flex-col-reverse border-t px-6 pt-4 pb-6 sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg leading-none font-semibold tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
